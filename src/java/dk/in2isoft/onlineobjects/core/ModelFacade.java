package dk.in2isoft.onlineobjects.core;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import nu.xom.Builder;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Elements;
import nu.xom.ParsingException;
import nu.xom.ValidityException;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.ScrollableResults;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.proxy.AbstractLazyInitializer;
import org.hibernate.proxy.HibernateProxy;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.events.EventManager;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.util.ModelClassInfo;

public class ModelFacade {

	private static Logger log = Logger.getLogger(ModelFacade.class);

	private static final SessionFactory sessionFactory;

	private Collection<ModelClassInfo> modelClassInfo;

	static {
		try {
			sessionFactory = new Configuration().configure().buildSessionFactory();
		} catch (Throwable t) {
			log.fatal("Could not create session factory", t);
			throw new ExceptionInInitializerError(t);
		}
	}

	protected ModelFacade() {
		loadModelInfo();
	}

	@SuppressWarnings("unchecked")
	private void loadModelInfo() {
		log.info("Loading model info");
		InputStream stream = this.getClass().getClassLoader().getResourceAsStream("model.xml");
		Builder parser = new Builder();
		Document doc;
		try {
			doc = parser.build(stream);
			modelClassInfo = new ArrayList<ModelClassInfo>();
			Elements items = doc.getRootElement().getChildElements("item");
			for (int i = 0; i < items.size(); i++) {
				Element item = items.get(i);
				Element classElement = item.getFirstChildElement("class");
				String className = classElement.getValue();
				Class<?> clazz = Class.forName("dk.in2isoft.onlineobjects.model." + className);
				ModelClassInfo info = new ModelClassInfo((Class<Item>) clazz);
				modelClassInfo.add(info);
			}
			log.info("Model info loaded: " + modelClassInfo.size() + " items");
		} catch (ValidityException e) {
			log.error("Could not load model info", e);
		} catch (ParsingException e) {
			log.error("Could not load model info", e);
		} catch (IOException e) {
			log.error("Could not load model info", e);
		} catch (ClassNotFoundException e) {
			log.error("Could not load model info", e);
		}

	}

	public Collection<ModelClassInfo> getClassInfo() {
		return modelClassInfo;
	}

	public Collection<ModelClassInfo> getClassInfo(Class<?> interfaze) {
		Collection<ModelClassInfo> infos = new ArrayList<ModelClassInfo>();
		for (ModelClassInfo info : modelClassInfo) {
			if (interfaze.isAssignableFrom(info.getModelClass())) {
				infos.add(info);
			}
		}
		return infos;
	}

	private Session getSession() {
		Session session = sessionFactory.getCurrentSession();
		if (!session.getTransaction().isActive()) {
			session.beginTransaction();
			log.info("Begin transaction!");
		}
		return session;
	}

	public Session openSession() {
		return sessionFactory.openSession();
	}

	public void commit() {
		Session session = sessionFactory.getCurrentSession();
		Transaction tx = session.getTransaction();
		if (tx.isActive()) {
			tx.commit();
			log.info("Commit transaction!");
		}
	}

	@SuppressWarnings("unchecked")
	public List<Entity> listEntities() {

		List<Entity> result = getSession().createQuery("from Entity").list();
		unpackEntities(result);
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> listRelations() {

		List<Relation> result = getSession().createQuery("from Relation").list();
		unpackRelations(result);
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Entity> listEntities(Class className) {

		List<Entity> result = getSession().createQuery("from " + className.getSimpleName()).list();
		unpackEntities(result);

		return result;
	}

	public void createItem(Item item, Priviledged priviledged) throws ModelException {
		createItem(item, priviledged, getSession());
	}

	public void createItem(Item item, Priviledged priviledged, Session session) throws ModelException {
		if (!item.isNew()) {
			throw new ModelException("Tried to create an already created item!");
		}
		item.setCreated(new Date());
		item.setUpdated(new Date());
		session.save(item);
		Privilege privilege = new Privilege(priviledged.getIdentity(), item.getId(), true);
		session.save(privilege);
		EventManager.getInstance().fireItemWasCreated(item);
	}

	public void deleteEntity(Entity entity, Priviledged priviledged) throws ModelException, SecurityException {
		List<Relation> subs = getSubRelations(entity);
		for (Relation relation : subs) {
			deleteItem(relation, priviledged);
		}
		List<Relation> supers = getSuperRelations(entity);
		for (Relation relation : supers) {
			deleteItem(relation, priviledged);
		}
		deleteItem(entity, priviledged);
	}

	private void deleteItem(Item item, Priviledged priviledged) throws SecurityException {
		Privilege privilege = getPriviledge(item, priviledged);
		if (privilege == null || !privilege.isDelete()) {
			throw new SecurityException("Privilieged=" + priviledged.getIdentity() + " cannot delete Item="
					+ item.getId());
		}
		removePrivileges(item, priviledged);
		getSession().delete(item);
		EventManager.getInstance().fireItemWasDeleted(item);
	}

	public void updateItem(Item item, Priviledged priviledged) throws SecurityException, ModelException {
		updateItem(item, priviledged, getSession());
	}

	public void updateItem(Item item, Priviledged priviledged, Session session) throws SecurityException,
			ModelException {
		if (item.getId() != priviledged.getIdentity()) {
			Privilege privilege = getPriviledge(item, priviledged, session);
			if (privilege == null || !privilege.isAlter()) {
				throw new SecurityException("Privilieged=" + priviledged.getIdentity() + " cannot alter Item="
						+ item.getId());
			}
		}
		item.setUpdated(new Date());
		session.update(item);
		EventManager.getInstance().fireItemWasUpdated(item);
	}

	@SuppressWarnings("unchecked")
	private Entity loadEntitys(Class entityClass, Long id) throws ModelException {
		Entity entity = (Entity) getSession().get(entityClass, id);
		if (entity != null) {
			return entity;
		} else {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public <T extends Entity> T loadEntity(Class<T> type, Long id) throws ModelException {
		return (T) loadEntitys(type, id);
	}

	public void createRelation(Entity superEntity, Entity subEntity, Priviledged priviledged) throws ModelException {
		Relation relation = new Relation(superEntity, subEntity);
		createItem(relation, priviledged);
	}

	public void createRelation(Entity superEntity, Entity subEntity, String kind, Priviledged priviledged)
			throws ModelException {
		Relation relation = new Relation(superEntity, subEntity);
		relation.setKind(kind);
		createItem(relation, priviledged);
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getSubRelations(Entity entity) throws ModelException {
		String hql = "from Relation as relation where relation.superEntity=? order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity(0, entity);
		List<Relation> result = q.list();
		return result;
	}

	@SuppressWarnings("unchecked")
	public <T> List<T> getSubEntities(Entity entity, Class<T> classObj) throws ModelException {
		StringBuilder hql = new StringBuilder();
		hql
				.append("select entity from ")
				.append(classObj.getCanonicalName())
				.append(
						" as entity, Relation as relation where relation.subEntity.id=entity.id and relation.superEntity.id=:id order by relation.position");
		Query q = getSession().createQuery(hql.toString());
		q.setLong("id", entity.getId());
		List<T> subEntities = q.list();
		for (int i = 0; i < subEntities.size(); i++) {
			subEntities.set(i, getSubject(subEntities.get(i)));
		}
		return subEntities;
	}

	@SuppressWarnings("unchecked")
	public List<Entity> getSuperEntities(Entity entity, Class classObj) throws ModelException {
		Session session = getSession();
		StringBuilder hql = new StringBuilder();
		hql
				.append("select entity from ")
				.append(classObj.getCanonicalName())
				.append(
						" as entity, Relation as relation where relation.superEntity.id=entity.id and relation.subEntity.id=:id order by relation.position");
		Query q = session.createQuery(hql.toString());
		q.setLong("id", entity.getId());
		List<Entity> superEntities = q.list();
		for (int i = 0; i < superEntities.size(); i++) {
			superEntities.set(i, getSubject(superEntities.get(i)));
		}
		return superEntities;
	}

	public Entity getFirstSuperEntity(Entity entity, Class<?> classObj) throws ModelException {
		List<Entity> supers = getSuperEntities(entity, classObj);
		if (supers.size() > 0) {
			return supers.get(0);
		} else {
			return null;
		}
	}

	public <T extends Entity> T getFirstSubEntity(Entity entity, Class<T> classObj) throws ModelException {
		List<T> supers = getSubEntities(entity, classObj);
		if (supers.size() > 0) {
			return supers.get(0);
		} else {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public <T extends Entity> T getFirstSubRelation(Entity entity, String type, Class<T> classObj)
			throws ModelException {
		Session session = getSession();
		StringBuilder hql = new StringBuilder("select sub from ");
		hql.append(classObj.getName()).append(" as sub,");
		hql.append("Relation as relation,");
		hql.append(entity.getClass().getName()).append(" as super");
		hql.append(" where relation.superEntity.id=super.id and relation.subEntity.id=sub.id and super.id=:id");
		Query q = session.createQuery(hql.toString());
		q.setLong("id", entity.getId());
		List<Entity> list = q.list();
		if (list.size() > 0) {
			return (T) getSubject(list.get(0));
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	public <T extends Entity> T getFirstSuperRelation(Entity entity, String type, Class<T> classObj)
			throws ModelException {
		Session session = getSession();
		StringBuilder hql = new StringBuilder("select super from ");
		hql.append(classObj.getName()).append(" as super,");
		hql.append("Relation as relation,");
		hql.append(entity.getClass().getName()).append(" as sub");
		hql.append(" where relation.superEntity.id=super.id and relation.subEntity.id=sub.id and sub.id=:id");
		Query q = session.createQuery(hql.toString());
		q.setLong("id", entity.getId());
		List<Entity> list = q.list();
		if (list.size() > 0) {
			return (T) getSubject(list.get(0));
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getSuperRelations(Entity entity) throws ModelException {
		Session session = getSession();
		Query q = session.createQuery("from Relation as relation where relation.subEntity=?");
		q.setEntity(0, entity);
		List<Relation> result = q.list();
		return result;
	}

	public User getUser(String username) {
		Session session = getSession();
		Query q = session.createQuery("from User as user where lower(user.username)=lower(?)");
		q.setString(0, username);
		User user = (User) q.uniqueResult();
		if (user != null) {
			return user;
		} else {
			return null;
		}
	}

	public Privilege getPriviledge(Item item, Priviledged priviledged) {
		return getPriviledge(item, priviledged, getSession());
	}

	public Privilege getPriviledge(Item item, Priviledged priviledged, Session session) {
		Query q = session.createQuery("from Privilege as priv where priv.object=:object and priv.subject=:subject");
		q.setLong("object", item.getId());
		q.setLong("subject", priviledged.getIdentity());
		Privilege privilege = (Privilege) q.uniqueResult();
		if (privilege != null) {
			return privilege;
		} else {
			return null;
		}
	}

	public Privilege getPriviledge(long object, long subject) {
		Session session = getSession();
		Query q = session.createQuery("from Privilege as priv where priv.object=:object and priv.subject=:subject");
		q.setLong("object", object);
		q.setLong("subject", subject);
		Privilege privilege = (Privilege) q.uniqueResult();
		if (privilege != null) {
			return privilege;
		} else {
			return null;
		}
	}

	private void unpackEntities(List<Entity> list) {
		for (int i = 0; i < list.size(); i++) {
			list.set(i, getSubject(list.get(i)));
		}
	}

	private void unpackRelations(List<Relation> list) {
		for (int i = 0; i < list.size(); i++) {
			list.set(i, getSubject(list.get(i)));
		}
	}

	public <T> List<T> search(AbstractModelQuery<T> query) {
		return search(query, getSession());
	}

	@SuppressWarnings("unchecked")
	public <T> List<T> search(AbstractModelQuery<T> query, Session session) {
		Priviledged priviledged = query.getPriviledged();
		StringBuilder hql = new StringBuilder("select distinct obj from ");
		hql.append(query.getClazz().getName());
		hql.append(" as obj");
		if (priviledged != null) {
			hql.append(",").append(Privilege.class.getName()).append(" as priv");
		}
		if (query.getParent() != null) {
			hql.append(",").append(Relation.class.getName()).append(" as parentRelation");
		}
		if (query.getChild() != null) {
			hql.append(",").append(Relation.class.getName()).append(" as childRelation");
		}
		if (LangUtil.isDefined(query.getWords()) && Entity.class.isAssignableFrom(query.getClazz())
				|| query.getCustomProperties().size() > 0) {
			hql.append(" left join obj.properties as p");
		}
		if (query.getParent() != null) {
			// TODO is this necessary
			hql.append(" left join parentRelation.superEntity as parentSuper");
			hql.append(" left join parentRelation.subEntity as parentSub");
		}
		if (query.getChild() != null) {
			// TODO is this necessary
			hql.append(" left join childRelation.superEntity as childSuper");
			hql.append(" left join childRelation.subEntity as childSub");
		}
		hql.append(" where obj.id>0");
		if (LangUtil.isDefined(query.getWords())) {
			for (int i = 0; i < query.getWords().length; i++) {
				hql.append(" and (lower(obj.name) like lower(:word" + i + ") or lower(p.value) like lower(:word" + i
						+ "))");
			}
		}
		if (query.getCustomProperties().size() > 0) {
			hql.append(" and p.key=:propertyKey and p.value=:propertyValue");
		}
		if (query.getLimitations().size() > 0) {
			for (ModelPropertyLimitation limit : query.getLimitations()) {
				hql.append(" and ").append(limit.getProperty());
				hql.append(limit.getComparison());
				hql.append(":").append(limit.getProperty());
			}
		}
		if (query.getParent() != null) {
			hql.append(" and parentSuper.id=:parent and parentSub.id=obj.id");
		}
		if (query.getChild() != null) {
			hql.append(" and childSuper.id=obj.id and childSub.id=:child");
		}
		if (priviledged != null) {
			hql.append(" and obj.id = priv.object and priv.subject=").append(priviledged.getIdentity());
		}
		if (query.getCreatedFrom() != null) {
			hql.append(" and obj.created>=:createdFrom");
		}
		if (query.getCreatedTo() != null) {
			hql.append(" and obj.created<=:createdTo");
		}
		if (Entity.class.isAssignableFrom(query.getClazz())) {
			hql.append(" order by obj.name");
		}
		Query q = session.createQuery(hql.toString());
		if (query.getPageSize() > 0) {
			q.setMaxResults(query.getPageSize());
			q.setFirstResult(query.getPageNumber() * query.getPageSize());
		}
		for (Iterator<ModelPropertyLimitation> i = query.getLimitations().iterator(); i.hasNext();) {
			ModelPropertyLimitation limit = i.next();
			Object value = limit.getValue();
			if (value instanceof Date) {
				q.setDate(limit.getProperty(), (Date) limit.getValue());
			} else {
				q.setString(limit.getProperty(), limit.getValue().toString());
			}
		}
		if (LangUtil.isDefined(query.getWords())) {
			for (int i = 0; i < query.getWords().length; i++) {
				String word = query.getWords()[i];
				q.setString("word" + i, "%" + word + "%");
			}
		}
		if (query.getCustomProperties().size() > 0) {
			// TODO: more than one property
			Entry<String, Object> entry = query.getCustomProperties().entrySet().iterator().next();
			q.setString("propertyKey", entry.getKey());
			q.setString("propertyValue", entry.getValue().toString());
		}
		if (query.getCreatedFrom() != null) {
			q.setDate("createdFrom", query.getCreatedFrom());
		}
		if (query.getCreatedTo() != null) {
			q.setDate("createdTo", query.getCreatedTo());
		}
		if (query.getParent() != null) {
			q.setLong("parent", query.getParent().getId());
		}
		if (query.getChild() != null) {
			q.setLong("child", query.getChild().getId());
		}
		List<T> items = q.list();
		for (int i = 0; i < items.size(); i++) {
			T item = items.get(i);
			items.set(i, getSubject(item));
		}
		return items;
	}

	public void grantFullPrivileges(Item item, Priviledged priviledged) {
		Session session = getSession();
		Privilege privilege = getPriviledge(item.getId(), priviledged.getIdentity());
		if (privilege == null) {
			privilege = new Privilege(priviledged.getIdentity(), item.getId(), true);
			session.save(privilege);
		}
	}

	@SuppressWarnings("unchecked")
	public void removePrivileges(Item item, Priviledged priviledged) {
		Session session = getSession();
		String hql = "from Privilege p where p.subject = :id or p.object = :id";
		Query q = session.createQuery(hql);
		q.setLong("id", item.getId());
		List<Privilege> privileges = q.list();
		log.info("Deleting privileges for: " + item.getClass().getName() + "; count: " + privileges.size());
		for (Iterator<Privilege> i = privileges.iterator(); i.hasNext();) {
			Privilege privilege = i.next();
			session.delete(privilege);
		}

	}

	public List<Entity> getSubEntities(Entity item, String relationKind, Priviledged priviledged) throws ModelException {
		List<Entity> entities = new ArrayList<Entity>();
		List<Relation> relations = getSubRelations(item);
		for (Relation relation : relations) {
			if (relationKind.equals(relation.getKind())) {
				entities.add(relation.getSubEntity());
			}
		}
		unpackEntities(entities);
		return entities;
	}

	public Class<?> getModelClass(String simpleName) throws ModelException {
		try {
			return Class.forName("dk.in2isoft.onlineobjects.model." + simpleName);
		} catch (ClassNotFoundException e) {
			throw new ModelException("Could not find class with simple name=" + simpleName);
		}
	}

	@SuppressWarnings("unchecked")
	public List<Property> getProperties(String key) {
		Session session = getSession();
		String hql = "from Property";
		Query q = session.createQuery(hql);
		// q.setString("key", key);
		return q.list();
	}

	public Map<String, Float> getPropertyCloud(String key, String query) {
		Map<String, Float> cloud = new LinkedHashMap<String, Float>();
		Session session = getSession();
		StringBuilder hql = new StringBuilder();
		hql.append("select value as value,count(id) as count from Property where key=:key");
		if (LangUtil.isDefined(query)) {
			hql.append(" and value like :query");
		}
		hql.append(" group by value");
		Query q = session.createQuery(hql.toString());
		q.setString("key", key);
		if (LangUtil.isDefined(query)) {
			q.setString("query", "%" + query + "%");
		}
		ScrollableResults scroll = q.scroll();
		while (scroll.next()) {
			cloud.put(scroll.getString(0), scroll.getLong(1).floatValue());
		}
		float max = 0;
		for (Float count : cloud.values()) {
			max = Math.max(max, count);
		}
		for (Map.Entry<String, Float> entry : cloud.entrySet()) {
			entry.setValue(entry.getValue() / max);
		}
		return cloud;
	}

	public Relation getRelation(Entity parent, Entity child, String kind) {
		Session session = getSession();
		StringBuilder hql = new StringBuilder("from Relation as r ");
		hql.append(" where r.superEntity.id=:parent and r.subEntity.id=:child and r.kind=:kind");
		Query q = session.createQuery(hql.toString());
		q.setLong("parent", parent.getId());
		q.setLong("child", child.getId());
		q.setString("kind", kind);
		List<Relation> list = list(q, Relation.class);
		if (list.size() > 0) {
			return getSubject(list.get(0));
		}
		return null;
	}

	/* Util */

	@SuppressWarnings("unchecked")
	private <T> List<T> list(Query q, Class<T> classObj) {
		return (List<T>) q.list();
	}

	/**
	 * @return the subject that a HibernateProxy object proxies or
	 *         <code>object</code> as-is if not proxied by Hibernate
	 */
	@SuppressWarnings("unchecked")
	private <T> T getSubject(T obj) {
		// XXX The below "fix" is needed by Hibernate 3.0.5, please check if it
		// is needed in future versions
		// Fixed so that initialized objects actually are instance of their
		// correct class and not just Content
		if (obj instanceof HibernateProxy)
			obj = (T) ((AbstractLazyInitializer) ((HibernateProxy) obj).getHibernateLazyInitializer())
					.getImplementation();
		return obj;
	}
}
