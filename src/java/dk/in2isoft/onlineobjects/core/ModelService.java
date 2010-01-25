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

import nu.xom.Builder;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Elements;
import nu.xom.ParsingException;
import nu.xom.ValidityException;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.ScrollableResults;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.persister.entity.EntityPersister;
import org.hibernate.proxy.AbstractLazyInitializer;
import org.hibernate.proxy.HibernateProxy;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.junk.HibernateUtil;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.util.ModelClassInfo;

public class ModelService {

	private static Logger log = Logger.getLogger(ModelService.class);

	private static final SessionFactory sessionFactory;

	private EventService eventService;
	
	private Collection<ModelClassInfo> modelClassInfo;
	private List<Class<?>> classes = Lists.newArrayList(); 
	private List<Class<? extends Entity>> entityClasses = Lists.newArrayList(); 

	static {
		try {
			sessionFactory = new Configuration().configure().buildSessionFactory();
		} catch (Throwable t) {
			log.fatal("Could not create session factory", t);
			throw new ExceptionInInitializerError(t);
		}
	}

	protected ModelService() {
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
		SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
		Map<Object, Object> metadata = sessionFactory.getAllClassMetadata();
		for (Iterator<Object> i = metadata.values().iterator(); i.hasNext();) {
			EntityPersister persister = (EntityPersister) i.next();
			String className = persister.getClassMetadata().getEntityName();
			Class<?> clazz;
			try {
				clazz = Class.forName(className);
				log.info(clazz + " with super " + clazz.getSuperclass());
				if (clazz.getSuperclass().equals(Entity.class)) {
					entityClasses.add((Class<? extends Entity>) clazz);
				}
				classes.add(clazz);
			} catch (ClassNotFoundException e) {
				log.error("Could not find model class: "+className);
			}
		}

	}

	public Collection<ModelClassInfo> getClassInfo() {
		return modelClassInfo;
	}

	public ModelClassInfo getClassInfo(String simpleName) {
		for (ModelClassInfo info : modelClassInfo) {
			if (info.getSimpleName().equals(simpleName)) {
				return info;
			}
		}
		return null;
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

	public Class<?> getModelClass(String simpleName) throws ModelException {
		try {
			return Class.forName("dk.in2isoft.onlineobjects.model." + simpleName);
		} catch (ClassNotFoundException e) {
			throw new ModelException("Could not find class with simple name=" + simpleName);
		}
	}
	
	public Collection<Class<? extends Entity>> getEntityClasses() {
		return entityClasses;
	}
	
	public Class<? extends Entity> getEntityClass(String simpleName) {
		for (Class<? extends Entity> cls : entityClasses) {
			if (cls.getSimpleName().equals(simpleName)) {
				return cls;
			}
		}
		return null;
	}

	private Session getSession() {
		Session session = sessionFactory.getCurrentSession();
		if (!session.getTransaction().isActive()) {
			session.beginTransaction();
			log.debug("Begin transaction!");
		}
		return session;
	}

	public void addToSession(Item item) {
		getSession().merge(item);
	}

	public void commit() {
		Session session = sessionFactory.getCurrentSession();
		Transaction tx = session.getTransaction();
		if (tx.isActive()) {
			getSession().flush();
			getSession().clear();
			tx.commit();
			log.debug("Commit transaction!");
		}
	}

	public void createOrUpdateItem(Item item, Priviledged priviledged) throws ModelException, SecurityException {
		if (item.isNew()) {
			createItem(item, priviledged, getSession());
		} else {
			updateItem(item, priviledged);
		}
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
		eventService.fireItemWasCreated(item);
	}

	public void deleteEntity(Entity entity, Priviledged priviledged) throws ModelException, SecurityException {
		removeAllRelations(entity);
		deleteItem(entity, priviledged);
	}

	private void removeAllRelations(Entity entity) {
		Session session = getSession();
		{
			String hql = "delete Privilege p where p.object in (select relation.id from Relation relation where relation.superEntity=:entity or relation.subEntity=:entity)";
			Query q = session.createQuery(hql);
			q.setEntity("entity", entity);
			int count = q.executeUpdate();
			log.info("Deleting relation privileges for: " + entity.getClass().getName() + "; count: " + count);
		}
		{
			String hql = "delete Relation relation where relation.superEntity=:entity or relation.subEntity=:entity)";
			Query q = session.createQuery(hql);
			q.setEntity("entity", entity);
			int count = q.executeUpdate();
			log.info("Deleting relations for: " + entity.getClass().getName() + "; count: " + count);
		}
	}

	public void deleteRelation(Relation relation, Priviledged priviledged) throws SecurityException, ModelException {
		deleteItem(relation, priviledged);
	}

	private void deleteItem(Item item, Priviledged priviledged) throws SecurityException, ModelException {
		if (!canDelete(item, priviledged)) {
			throw new SecurityException("Privilieged=" + priviledged + " cannot delete Item=" + item);
		}
		removeAllPrivileges(item);
		try {
			getSession().delete(item);
		} catch (HibernateException e) {
			log.error(e.getMessage(), e);
			throw new ModelException(e);
		}
		eventService.fireItemWasDeleted(item);
	}

	public void updateItem(Item item, Priviledged priviledged) throws SecurityException,
			ModelException {
		if (!canUpdate(item, priviledged)) {
			throw new SecurityException("Privilieged=" + priviledged + " cannot update Item=" + item);
		}
		Session session = getSession();
		item.setUpdated(new Date());
		session.update(item);
		eventService.fireItemWasUpdated(item);
	}
	
	private boolean canUpdate(Item item, Priviledged priviledged) {
		if (priviledged.isSuper()) {
			return true;
		}
		if (item.getId() == priviledged.getIdentity()) {
			return true;
		}
		Privilege privilege = getPriviledge(item, priviledged, getSession());
		if (privilege != null && privilege.isAlter()) {
			return true;
		}
		return false;
	}
	
	private boolean canDelete(Item item, Priviledged priviledged) {
		if (item instanceof User) {
			User user = (User) item;
			if (SecurityService.ADMIN_USERNAME.equals(user.getUsername())) {
				return false;
			}
		}
		if (priviledged.isSuper()) {
			return true;
		}
		if (item.getId() == priviledged.getIdentity()) {
			return false;
		}
		Privilege privilege = getPriviledge(item, priviledged, getSession());
		if (privilege != null && privilege.isDelete()) {
			return true;
		}
		return false;
	}

	@SuppressWarnings("unchecked")
	public <T extends Entity> T get(Class<T> entityClass, Long id) throws ModelException {
		T entity = (T) getSession().get(entityClass, id);
		//getSession().evict(entity);
		//getSession().evict(entity.getProperties());
		if (entity != null) {
			return entity;
		} else {
			return null;
		}
	}

	public void createRelation(Entity parent, Entity child, Priviledged priviledged) throws ModelException {
		Relation relation = new Relation(parent, child);
		createItem(relation, priviledged);
	}

	public void createRelation(Entity parent, Entity child, String kind, Priviledged priviledged)
			throws ModelException {
		Relation relation = new Relation(parent, child);
		relation.setKind(kind);
		createItem(relation, priviledged);
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getRelations(Entity entity) throws ModelException {
		String hql = "from Relation as relation where relation.superEntity=:entity or relation.subEntity=:entity order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		List<Relation> result = q.list();
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getChildRelations(Entity entity) throws ModelException {
		String hql = "from Relation as relation where relation.superEntity=? order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity(0, entity);
		List<Relation> result = q.list();
		for (int i = 0; i < result.size(); i++) {
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getChildRelations(Entity entity, Class clazz) throws ModelException {
		String hql = "select relation from Relation as relation,"+clazz.getName()+" child where relation.superEntity=:entity and relation.subEntity=child order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		List<Relation> result = q.list();
		for (int i = 0; i < result.size(); i++) {
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getChildRelations(Entity entity, Class clazz,String relationKind) throws ModelException {
		String hql = "select relation from Relation as relation,"+clazz.getName()+" child where relation.superEntity=:entity and relation.subEntity=child and relation.kind=:kind order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		q.setString("kind", relationKind);
		List<Relation> result = q.list();
		for (int i = 0; i < result.size(); i++) {
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	public <T> List<T> getParents(Entity entity, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.withChild(entity);
		return list(q);
	}

	public <T extends Entity> T getParent(Entity entity, Class<T> classObj) throws ModelException {
		return getParent(entity, null, classObj);
	}

	public <T extends Entity> T getParent(Entity entity, String kind, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.withChild(entity,kind).withPaging(0, 1);
		List<T> supers = list(q);
		if (!supers.isEmpty()) {
			return supers.get(0);
		} else {
			return null;
		}
	}

	public <T extends Entity> T getChild(Entity entity, Class<T> classObj) throws ModelException {
		return getChild(entity, null, classObj);
	}

	public <T extends Entity> T getChild(Entity entity, String kind, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.withParent(entity,kind).withPaging(0, 1);
		List<T> supers = list(q);
		if (!supers.isEmpty()) {
			return supers.get(0);
		} else {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getParentRelations(Entity entity) throws ModelException {
		Session session = getSession();
		Query q = session.createQuery("from Relation as relation where relation.subEntity=?");
		q.setEntity(0, entity);
		List<Relation> result = q.list();
		return result;
	}

	public User getUser(String username) {
		Session session = getSession();
		Query q = session.createQuery("from User as user left join fetch user.properties where lower(user.username)=lower(?)");
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
	
	public User getOwner(Image image) throws ModelException {
		Session session = getSession();
		Query q = session.createQuery("select user from User as user, Privilege as priv where priv.alter=true and priv.object=:object and priv.subject=user.id");
		q.setLong("object", image.getId());
		return (User) q.uniqueResult();
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

	@SuppressWarnings("unchecked")
	public List<Long> listIds(IdQuery query) {
		Query q = query.createIdQuery(getSession());
		List<Long> items = q.list();
		return items;
	}

	public <T> Results<T> scroll(ItemQuery<T> query) {
		Query q = query.createItemQuery(getSession());
		return new Results<T>(q.scroll());
	}

	@SuppressWarnings("unchecked")
	public <T> List<T> list(ItemQuery<T> query) {
		Query q = query.createItemQuery(getSession());
		q.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
		List<T> items = q.list();
		for (int i = 0; i < items.size(); i++) {
			T item = items.get(i);
			items.set(i, getSubject(item));
		}
		log.debug("items: "+items.size());
		return items;
	}

	@SuppressWarnings("unchecked")
	public <T> SearchResult<T> search(ItemQuery<T> query) {
		Query cq = query.createCountQuery(getSession());
		List list = cq.list();
		Object next = list.iterator().next();
		Long count = (Long) next;
		Query q = query.createItemQuery(getSession());
		q.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
		List<T> items = q.list();
		for (int i = 0; i < items.size(); i++) {
			T item = items.get(i);
			items.set(i, getSubject(item));
		}
		return new SearchResult<T>(items,count.intValue());
	}

	@SuppressWarnings("unchecked")
	public <T,U> PairSearchResult<T,U> searchPairs(PairQuery<T,U> query) {
		Query cq = query.createCountQuery(getSession());
		List list = cq.list();
		Object next = list.iterator().next();
		Long count = (Long) next;
		Query q = query.createItemQuery(getSession());
		//q.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
		List<Pair<T, U>> map = new ArrayList<Pair<T, U>>();
		for (Iterator i = q.iterate(); i.hasNext();) {
			Object[] object = (Object[]) i.next();
			map.add(new Pair((T)getSubject(object[0]), (U)getSubject(object[1])));
		}
		return new PairSearchResult<T,U>(map,count.intValue());
	}

	public void grantFullPrivileges(Item item, Priviledged priviledged) {
		Session session = getSession();
		Privilege privilege = getPriviledge(item.getId(), priviledged.getIdentity());
		if (privilege == null) {
			privilege = new Privilege(priviledged.getIdentity(), item.getId(), true);
			session.save(privilege);
		}
	}

	private void removeAllPrivileges(Item item) {
		Session session = getSession();
		String hql = "delete Privilege p where p.object = :id";
		Query q = session.createQuery(hql);
		q.setLong("id", item.getId());
		int count = q.executeUpdate();
		log.info("Deleting privileges for: " + item.getClass().getName() + "; count: " + count);
	}

	public List<Entity> getChildren(Entity item, String relationKind, Priviledged priviledged) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<Entity> q = dk.in2isoft.onlineobjects.core.Query.of(Entity.class);
		q.withPriviledged(priviledged).withParent(item,relationKind);
		return list(q);
	}

	/**
	 * Performance warning!
	 */
	public List<Entity> getChildren(Entity item, String relationKind) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<Entity> q = dk.in2isoft.onlineobjects.core.Query.of(Entity.class);
		q.withParent(item,relationKind);
		return list(q);
	}

	public <T> List<T> getChildren(Entity item, String relationKind, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.withParent(item,relationKind);
		return list(q);
	}

	public <T> List<T> getChildren(Entity entity, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.withParent(entity);
		return list(q);
	}

	public <T> List<T> getChildrenOrdered(Entity entity, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.withParent(entity).inPosition();
		return list(q);
	}

	@SuppressWarnings("unchecked")
	public List<Property> getProperties(String key) {
		Session session = getSession();
		String hql = "from Property";
		Query q = session.createQuery(hql);
		// q.setString("key", key);
		return q.list();
	}

	public Map<String, Float> getPropertyCloud(String key, String query, Class<? extends Entity> cls) {
		Map<String, Float> cloud = new LinkedHashMap<String, Float>();
		Session session = getSession();
		StringBuilder hql = new StringBuilder();
		hql.append("select p.value as value,count(p.id) as count from ");
		hql.append(cls.getSimpleName()).append(" as entity");
		hql.append(" left join entity.properties as p where p.key=:key");
		if (LangUtil.isDefined(query)) {
			hql.append(" and lower(value) like lower(:query)");
		}
		hql.append(" group by p.value order by lower(value)");
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
	
	public Map<String, Integer> getProperties(String key, Class<? extends Entity> cls, Priviledged priviledged) {
		Session session = getSession();
		StringBuilder hql = new StringBuilder();
		hql.append("select p.value as value,count(p.id) as count from ");
		hql.append(cls.getSimpleName()).append(" as entity");
		if (priviledged!=null) {
			hql.append(",").append(Privilege.class.getName()).append(" as priv");
		}
		hql.append(" left join entity.properties as p  where p.key=:key");
		if (priviledged!=null) {
			hql.append(" and entity.id = priv.object and priv.subject=").append(priviledged.getIdentity());
		}
		hql.append(" group by p.value order by lower(value)");
		Query q = session.createQuery(hql.toString());
		q.setString("key", key);
		Map<String, Integer> list = new LinkedHashMap<String, Integer>();
		ScrollableResults scroll = q.scroll();
		while (scroll.next()) {
			list.put(scroll.getString(0), scroll.getLong(1).intValue());
		}
		return list;
	}

	public Relation getRelation(Entity parent, Entity child) {
		Session session = getSession();
		StringBuilder hql = new StringBuilder("from Relation as r ");
		hql.append(" where r.superEntity.id=:parent and r.subEntity.id=:child");
		Query q = session.createQuery(hql.toString());
		q.setLong("parent", parent.getId());
		q.setLong("child", child.getId());
		List<Relation> list = list(q, Relation.class);
		if (list.size() > 0) {
			return getSubject(list.get(0));
		}
		return null;
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
	public static <T> T getSubject(T obj) {
		// XXX The below "fix" is needed by Hibernate 3.0.5, please check if it
		// is needed in future versions
		// Fixed so that initialized objects actually are instance of their
		// correct class and not just Content

		if (obj instanceof HibernateProxy)
			obj = (T) ((AbstractLazyInitializer) ((HibernateProxy) obj).getHibernateLazyInitializer())
					.getImplementation();
		return obj;
	}

	public void setEventService(EventService eventService) {
		this.eventService = eventService;
	}

	public EventService getEventService() {
		return eventService;
	}
}
