package dk.in2isoft.onlineobjects.core;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.proxy.AbstractLazyInitializer;
import org.hibernate.proxy.HibernateProxy;

import dk.in2isoft.onlineobjects.core.events.EventManager;
import dk.in2isoft.onlineobjects.junk.HibernateUtil;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class ModelFacade {

	private static Logger log = Logger.getLogger(ModelFacade.class);
	
	protected ModelFacade() {

	}
	
	private Session getSession() {
		return HibernateUtil.getSessionFactory().getCurrentSession();
	}
	
	public void commit() {
		Transaction tx = getSession().getTransaction();
		if (tx.isActive()) {
			tx.commit();
		}
	}

	@SuppressWarnings("unchecked")
	public List<Entity> listEntities() {
		Session session = getSession();
		session.beginTransaction();

		List<Entity> result = session.createQuery("from Entity").list();
		unpackEntities(result);
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> listRelations() {
		Session session = getSession();
		session.beginTransaction();

		List<Relation> result = session.createQuery("from Relation").list();
		unpackRelations(result);
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Entity> listEntities(Class className) {
		Session session = getSession();

		session.beginTransaction();

		List<Entity> result = session.createQuery("from "+className.getSimpleName()).list();
		unpackEntities(result);

		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Entity> searchEntities(ModelQuery query) {
		Session session = getSession();

		session.beginTransaction();
		StringBuilder hql = new StringBuilder();
		hql.append("from ").append(query.getType()).append(" as entity where entity.id>0");
		if (query.getWords()!=null && query.getWords().length>0) {
			for (int i = 0; i < query.getWords().length; i++) {
				hql.append(" and lower(entity.name) like lower(:word"+i+")");
			}
		}
		hql.append(" order by lower(entity.name)");
		log.info(hql.toString());
		Query q = session.createQuery(hql.toString());
		//q.setString("type", "Entity");
		if (query.getWords()!=null && query.getWords().length>0) {
			for (int i = 0; i < query.getWords().length; i++) {
				String word = query.getWords()[i];
				q.setString("word"+i,"%"+word+"%");
			}
		}
		List<Entity> result = q.list();
		unpackEntities(result);
		return result;
	}

	public void saveItem(Item item,Priviledged priviledged) {
		Session session = getSession();
		session.beginTransaction();
		session.save(item);
		Privilege privilege = new Privilege(priviledged.getIdentity(),item.getId(),true);
		session.save(privilege);
		EventManager.getInstance().fireItemWasCreated(item);
	}
	
	public void deleteEntity(Entity entity) throws ModelException {
		List<Relation> subs = getSubRelations(entity);
		for (Relation relation : subs) {
			deleteItem(relation);
		}
		List<Relation> supers = getSuperRelations(entity);
		for (Relation relation : supers) {
			deleteItem(relation);
		}
		deleteItem(entity);
	}

	public void deleteItem(Item item) {
		Session session = getSession();
		session.beginTransaction();
		session.delete(item);
	}

	public void updateItem(Item item,Priviledged priviledged) {
		Session session = getSession();
		session.beginTransaction();
		session.update(item);
		EventManager.getInstance().fireItemWasUpdated(item);
	}

	@SuppressWarnings("unchecked")
	public Entity loadEntity(Class entityClass,Long id)
	throws ModelException {
		Session session = getSession();
		session.beginTransaction();
		Entity entity = (Entity) session.get(entityClass, id);
		if (entity!=null) {
			return entity;
		} else {
			throw new ModelException("Could not load entity with class="+entityClass.getSimpleName()+" and id="+id);
		}
	}

	public void createRelation(Entity superEntity, Entity subEntity, Priviledged priviledged) {
		Relation relation = new Relation(superEntity,subEntity);
		saveItem(relation,priviledged);
	}
	
	@SuppressWarnings("unchecked")
	public List<Relation> getSubRelations(Entity entity)
	throws ModelException {
		Session session = getSession();
		session.beginTransaction();
		Query q = session.createQuery("from Relation as relation where relation.superEntity=? order by relation.position");
		q.setEntity(0,entity);
		List<Relation> result = q.list();
		return result;
	}
	
	@SuppressWarnings("unchecked")
	public List<Entity> getSubEntities(Entity entity, Class classObj)
	throws ModelException {
		Session session = getSession();
		session.beginTransaction();
		StringBuilder hql = new StringBuilder();
		hql.append("select entity from ").append(classObj.getCanonicalName()).append(" as entity, Relation as relation where relation.subEntity.id=entity.id and relation.superEntity.id=:id order by relation.position");
		Query q = session.createQuery(hql.toString());
		q.setLong("id", entity.getId());
		List<Entity> subEntities = q.list();
		for (int i = 0; i < subEntities.size(); i++) {
			subEntities.set(i, getSubject(subEntities.get(i)));
		}
		return subEntities;
	}
	
	@SuppressWarnings("unchecked")
	public List<Entity> getSuperEntities(Entity entity, Class classObj)
	throws ModelException {
		Session session = getSession();
		session.beginTransaction();
		StringBuilder hql = new StringBuilder();
		hql.append("select entity from ").append(classObj.getCanonicalName()).append(" as entity, Relation as relation where relation.superEntity.id=entity.id and relation.subEntity.id=:id order by relation.position");
		Query q = session.createQuery(hql.toString());
		q.setLong("id", entity.getId());
		List<Entity> superEntities = q.list();
		for (int i = 0; i < superEntities.size(); i++) {
			superEntities.set(i, getSubject(superEntities.get(i)));
		}
		return superEntities;
	}
	public Entity getFirstSuperEntity(Entity entity, Class<?> classObj)
	throws ModelException {
		List<Entity> supers = getSuperEntities(entity, classObj);
		if (supers.size()>0) {
			return supers.get(0);
		} else {
			return null;
		}
	}
	
	public Entity getFirstSubRelation(Entity entity,String type, Class<?> classObj)
	throws ModelException {
		List<Relation> relations = getSubRelations(entity);
		for (Relation relation : relations) {
			if (relation.getSubEntity().getType().equals(type)) {
				return getSubject(relation.getSubEntity());
			}
		}
		return null;
	}
	
	public Entity getFirstSuperRelation(Entity entity,String type, Class<?> classObj)
	throws ModelException {
		List<Relation> relations = getSuperRelations(entity);
		for (Relation relation : relations) {
			if (relation.getSuperEntity().getType().equals(type)) {
				return getSubject(relation.getSuperEntity());
			}
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	public List<Relation> getSuperRelations(Entity entity)
	throws ModelException {
		Session session = getSession();
		session.beginTransaction();
		Query q = session.createQuery("from Relation as relation where relation.subEntity=?");
		q.setEntity(0,entity);
		List<Relation> result = q.list();
		return result;
	}
	
	public User getUser(String username) {
		Session session = getSession();
		session.beginTransaction();
		Query q = session.createQuery("from User as user where lower(user.username)=lower(?)");
		q.setString(0,username);
		User user = (User) q.uniqueResult();
		if (user!=null) {
			return user;
		} else {
			return null;
		}
	}
	
	public Privilege getPriviledge(long object, long subject) {
		Session session = getSession();
		session.beginTransaction();
		Query q = session.createQuery("from Privilege as priv where priv.object=:object and priv.subject=:subject");
		q.setLong("object", object);
		q.setLong("subject", subject);
		Privilege privilege = (Privilege) q.uniqueResult();
		if (privilege!=null) {
			return privilege;
		} else {
			return null;
		}
	}

	/*
	private String getEntityType(Class classObj) throws ModelException {
		try {
			Field field = classObj.getDeclaredField("TYPE");
			return field.get(classObj.newInstance()).toString();
		} catch (InstantiationException e) {
			throw new ModelException("Could not create instance of class: "+classObj,e);
		} catch (NoSuchFieldException e) {
			throw new ModelException("Could not get TYPE of class: "+classObj,e);
		} catch (IllegalAccessException e) {
			throw new ModelException("Could not access TYPE of class: "+classObj,e);
		}
	}
	*/
	
	private void unpackEntities(List<Entity> list) {
		for (int i=0;i<list.size();i++) {
			list.set(i, getSubject(list.get(i)));
		}
	}
	
	private void unpackRelations(List<Relation> list) {
		for (int i=0;i<list.size();i++) {
			list.set(i, getSubject(list.get(i)));
		}
	}
	
	/** @return the subject that a HibernateProxy object proxies or <code>object</code> as-is if not proxied by Hibernate */
	@SuppressWarnings("unchecked")
	public <T> T getSubject(T obj)
	{
		// XXX The below "fix" is needed by Hibernate 3.0.5, please check if it is needed in future versions
		// Fixed so that initialized objects actually are instance of their correct class and not just Content
		if(obj instanceof HibernateProxy)
			obj = (T)((AbstractLazyInitializer)((HibernateProxy)obj).getHibernateLazyInitializer()).getImplementation();
		return obj;
	}
}
