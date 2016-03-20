package dk.in2isoft.onlineobjects.core;

import java.io.IOException;
import java.io.InputStream;
import java.sql.BatchUpdateException;
import java.sql.SQLException;
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
import org.eclipse.jdt.annotation.NonNull;
import org.eclipse.jdt.annotation.Nullable;
import org.hibernate.CacheMode;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.ScrollMode;
import org.hibernate.ScrollableResults;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.exception.JDBCConnectionException;
import org.hibernate.exception.SQLGrammarException;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.proxy.AbstractLazyInitializer;
import org.hibernate.proxy.HibernateProxy;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.util.ModelClassInfo;

public class ModelService {

	private static Logger log = Logger.getLogger(ModelService.class);

	private static final SessionFactory sessionFactory;

	private EventService eventService;
	private SecurityService securityService;
	
	private Collection<ModelClassInfo> modelClassInfo;
	private List<Class<?>> classes = Lists.newArrayList(); 
	private List<Class<? extends Entity>> entityClasses = Lists.newArrayList(); 
	
	private static final ThreadLocal<String> threadIsDirty = new ThreadLocal<String>();

	static {
		try {
			sessionFactory = new Configuration().configure().buildSessionFactory();
		} catch (Throwable t) {
			log.fatal("Could not create session factory", t);
			throw new ExceptionInInitializerError(t);
		}
	}
	
	public static SessionFactory getSessionfactory() {
		return sessionFactory;
	}

	protected ModelService() {
		loadModelInfo();
	}

	@SuppressWarnings("unchecked")
	private void loadModelInfo() {
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
			log.debug("Model info loaded: " + modelClassInfo.size() + " items");
		} catch (ValidityException e) {
			log.error("Could not load model info", e);
		} catch (ParsingException e) {
			log.error("Could not load model info", e);
		} catch (IOException e) {
			log.error("Could not load model info", e);
		} catch (ClassNotFoundException e) {
			log.error("Could not load model info", e);
		}
		SessionFactory sessionFactory = new Configuration().configure().buildSessionFactory();
		Map<String, ClassMetadata> metadata = sessionFactory.getAllClassMetadata();
		for (Iterator<ClassMetadata> i = metadata.values().iterator(); i.hasNext();) {
			ClassMetadata metaData = i.next();
			String className = metaData.getEntityName();
			Class<?> clazz;
			try {
				clazz = Class.forName(className);
				log.debug(clazz + " with super " + clazz.getSuperclass());
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

	public Class<? extends Entity> getModelClass(String simpleName) throws ModelException {
		try {
			return Code.castClass(Class.forName("dk.in2isoft.onlineobjects.model." + simpleName));
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
		threadIsDirty.set("started");
		Session session = sessionFactory.getCurrentSession();
		if (!session.getTransaction().isActive()) {
			try {
				session.beginTransaction();
			} catch (JDBCConnectionException e) {
				// TODO Handle this somehow
			}
			log.debug("Begin transaction!");
		}
		return session;
	}

	public void addToSession(Item item) {
		getSession().merge(item);
	}
	
	public void clearAndFlush() {
		getSession().clear();
		getSession().flush();
	}

	public void commit() {
		Session session = getSession();
		Transaction tx = session.getTransaction();
		if (tx.isActive()) {
			try {
				session.flush();
				session.clear();
				tx.commit();
			} catch (HibernateException e) {
				log.error("Rolling back!", e);
				tx.rollback();
			}
			log.debug("Commit transaction!");
		}
	}
	
	public void startThread() {
		threadIsDirty.set("newborn");
	}
	
	public void commitThread() {
		String dirty = threadIsDirty.get();
		if ("started".equals(dirty)) {
			commit();
		}
	}

	public void rollBack() {
		Session session = getSession();
		Transaction tx = session.getTransaction();
		if (tx.isActive()) {
			try {
				tx.rollback();
				log.warn("Rolling back!");
			} catch (HibernateException e) {
				log.error("Could not roll back!", e);
			}
		}
	}

	public void createOrUpdateItem(Item item, Privileged privileged) throws ModelException, SecurityException {
		if (item.isNew()) {
			createItem(item, privileged, getSession());
		} else {
			updateItem(item, privileged);
		}
	}

	public void createItem(Item item, Privileged privileged) throws ModelException {
		createItem(item, privileged, getSession());
	}
	
	public boolean isDirty() {
		return getSession().isDirty();
	}

	private void createItem(Item item, Privileged privileged, Session session) throws ModelException {
		if (!item.isNew()) {
			throw new ModelException("Tried to create an already created item!");
		}
		item.setCreated(new Date());
		item.setUpdated(new Date());
		session.save(item);
		Privilege privilege = new Privilege(privileged.getIdentity(), item.getId(), true);
		session.save(privilege);
		eventService.fireItemWasCreated(item);
	}

	public void deleteEntity(Entity entity, Privileged privileged) throws ModelException, SecurityException {
		if (!canDelete(entity, privileged)) {
			throw new SecurityException("Privilieged=" + privileged + " cannot delete Entity=" + entity);
		}
		removeAllRelations(entity);
		deleteItem(entity, privileged);
	}

	private void removeAllRelations(Entity entity) {
		Session session = getSession();
		{
			String hql = "delete Privilege p where p.object in (select relation.id from Relation relation where relation.from=:entity or relation.to=:entity)";
			Query q = session.createQuery(hql);
			q.setEntity("entity", entity);
			int count = q.executeUpdate();
			log.info("Deleting relation privileges for: " + entity.getClass().getName() + "; count: " + count);
		}
		{
			String hql = "delete Relation relation where relation.from=:entity or relation.to=:entity)";
			Query q = session.createQuery(hql);
			q.setEntity("entity", entity);
			int count = q.executeUpdate();
			log.info("Deleting relations for: " + entity.getClass().getName() + "; count: " + count);
		}
	}

	public void deleteRelation(Relation relation, Privileged privileged) throws SecurityException, ModelException {
		deleteItem(relation, privileged);
	}

	public void deleteRelations(List<Relation> parents, Privileged privileged) throws SecurityException, ModelException {
		for (Relation relation : parents) {
			deleteItem(relation, privileged);
		}
	}

	private void deleteItem(Item item, Privileged privileged) throws SecurityException, ModelException {
		if (!canDelete(item, privileged)) {
			throw new SecurityException("Privilieged=" + privileged + " cannot delete Item=" + item);
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

	public void updateItem(Item item, Privileged privileged) throws SecurityException,
			ModelException {
		if (!canUpdate(item, privileged)) {
			throw new SecurityException("Privilieged=" + privileged + " cannot update Item=" + item);
		}
		Session session = getSession();
		item.setUpdated(new Date());
		session.update(item);
		eventService.fireItemWasUpdated(item);
	}

	
	public <T extends Entity> void syncRelationsFrom(Entity fromEntity, String relationKind, Class<T> toType, Collection<Long> ids, Privileged privileged) throws ModelException, SecurityException {
		List<Relation> relations = this.getRelationsFrom(fromEntity, toType, relationKind, privileged);
		List<Long> toAdd = Lists.newArrayList();
		toAdd.addAll(ids);
		for (Relation relation : relations) {
			if (!ids.contains(relation.getTo().getId())) {
				this.deleteRelation(relation, privileged);
			} else {
				toAdd.remove(relation.getTo().getId());
			}
		}
		if (!toAdd.isEmpty()) {
			List<T> list = this.list(dk.in2isoft.onlineobjects.core.Query.of(toType).withIds(toAdd));
			for (T t : list) {
				this.createRelation(fromEntity, t, relationKind, privileged);
			}
		}
	}
	
	public boolean canUpdate(Item item, Privileged privileged) {
		if (privileged.isSuper()) {
			return true;
		}
		if (item.getId() == privileged.getIdentity()) {
			return true;
		}
		Privilege privilege = getPriviledge(item, privileged, getSession());
		if (privilege != null && privilege.isAlter()) {
			return true;
		}
		return false;
	}
	
	private boolean canDelete(Item item, Privileged privileged) {
		return securityService.canDelete(item, privileged);
	}

	@SuppressWarnings("unchecked")
	@Deprecated
	public <T extends Entity> @Nullable T get(Class<T> entityClass, Long id) throws ModelException {
		T entity = (T) getSession().get(entityClass, id);
		if (entity != null) {
			return entity;
		} else {
			return null;
		}
	}

	public <T extends Entity> @NonNull T getRequired(@NonNull Class<T> entityClass, @NonNull Long id, @NonNull Privileged privileged) throws ModelException,ContentNotFoundException {
		@Nullable
		T found = get(entityClass, id, privileged);
		if (found==null) {
			throw new ContentNotFoundException(entityClass, id);
		}
		return found;
	}
	
	public <T extends Entity> @Nullable T get(@NonNull Class<T> entityClass, @NonNull Long id, @NonNull Privileged privileged) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> query = dk.in2isoft.onlineobjects.core.Query.of(entityClass);
		if (!privileged.isSuper()) {
			query.withPrivileged(privileged,securityService.getPublicUser());
		}
		query.withIds(id);
		List<T> result = list(query);
		if (!result.isEmpty()) {
			return result.get(0);
		}
		return null;
	}

	public Relation createRelation(Entity from, Entity to, Privileged privileged) throws ModelException {
		if (from==null || to==null) {
			return null;
		}
		Relation relation = new Relation(from, to);
		createItem(relation, privileged);
		return relation;
	}

	public Relation createRelation(Entity from, Entity to, String kind, Privileged privileged) throws ModelException {
		if (from==null || to==null) {
			return null;
		}
		Relation relation = new Relation(from, to);
		relation.setKind(kind);
		createItem(relation, privileged);
		return relation;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getRelations(Entity entity) throws ModelException {
		String hql = "from Relation as relation where relation.from=:entity or relation.to=:entity order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		List<Relation> result = q.list();
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getRelationsFrom(Entity entity) throws ModelException {
		String hql = "from Relation as relation where relation.from=? order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity(0, entity);
		List<Relation> result = q.list();
		for (int i = 0; i < result.size(); i++) {
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	public List<Relation> getRelationsFrom(Entity entity, Class<?> clazz) throws ModelException {
		String hql = "select relation from Relation as relation,"+clazz.getName()+" child where relation.from=:entity and relation.to=child order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		List<Relation> result = Code.castList(q.list());
		for (int i = 0; i < result.size(); i++) {
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	public List<Relation> getRelationsFrom(Entity entity, Class<?> clazz, Privileged privileged) throws ModelException {
		String hql = "select relation from Relation as relation,"+clazz.getName()+" child,Privilege as priv where relation.from=:entity and relation.to=child and priv.object=relation.to and priv.subject=:privileged order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		q.setLong("privileged", privileged.getIdentity());
		List<Relation> result = Code.castList(q.list());
		for (int i = 0; i < result.size(); i++) {
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	public List<Relation> getRelationsFrom(Entity entity, Class<?> clazz, String relationKind, Privileged privileged) throws ModelException {
		String hql = "select relation from Relation as relation,"+clazz.getName()+" child,Privilege as priv where relation.from=:entity and relation.to=child and relation.kind=:kind and priv.object=relation.to and priv.subject=:privileged order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		q.setString("kind", relationKind);
		q.setLong("privileged", privileged.getIdentity());
		List<Relation> result = Code.castList(q.list());
		for (int i = 0; i < result.size(); i++) {
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	public List<Relation> getRelationsTo(Entity entity, Class<?> clazz, String relationKind, Privileged privileged) throws ModelException {
		String hql = "select relation from Relation as relation,"+clazz.getName()+" child,Privilege as priv where relation.to=:entity and relation.from=child and relation.kind=:kind and priv.object=relation.from and priv.subject=:privileged order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		q.setString("kind", relationKind);
		q.setLong("privileged", privileged.getIdentity());
		List<Relation> result = Code.castList(q.list());
		for (int i = 0; i < result.size(); i++) {
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getRelationsFrom(Entity entity, Class<?> clazz,String relationKind) throws ModelException {
		String hql = "select relation from Relation as relation,"+clazz.getName()+" other where relation.from=:entity and relation.to=other and relation.kind=:kind order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		q.setString("kind", relationKind);
		List<Relation> result = q.list();
		for (int i = 0; i < result.size(); i++) {
			//getSession().getTransaction().rollback();
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getRelationsTo(Entity entity, Class<?> clazz) throws ModelException {
		String hql = "select relation from Relation as relation,"+clazz.getName()+" child where relation.to=:entity and relation.from=child order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		List<Relation> result = q.list();
		for (int i = 0; i < result.size(); i++) {
			//getSession().getTransaction().rollback();
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getRelationsTo(Entity entity) throws ModelException {
		Session session = getSession();
		Query q = session.createQuery("from Relation as relation where relation.to=?");
		q.setEntity(0, entity);
		List<Relation> result = q.list();
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Relation> getRelationsTo(Entity entity, Class<?> clazz,String relationKind) throws ModelException {
		String hql = "select relation from Relation as relation,"+clazz.getName()+" other where relation.to=:entity and relation.from=other and relation.kind=:kind order by relation.position";
		Query q = getSession().createQuery(hql);
		q.setEntity("entity", entity);
		q.setString("kind", relationKind);
		List<Relation> result = q.list();
		for (int i = 0; i < result.size(); i++) {
			//getSession().getTransaction().rollback();
			result.set(i, getSubject(result.get(i)));
		}
		return result;
	}

	public <T> List<T> getParents(Entity entity, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.to(entity);
		return list(q);
	}


	public <T> List<T> getParents(Entity entity, Class<T> classObj, Privileged privileged) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.to(entity);
		if (!privileged.isSuper()) {
			q.withPrivileged(privileged);
		}
		return list(q);
	}


	public <T> List<T> getParents(Entity entity, String kind, Class<T> classObj, Privileged privileged) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.to(entity,kind);
		if (!privileged.isSuper()) {
			q.withPrivileged(privileged);
		}
		return list(q);
	}

	public <T extends Entity> @Nullable T getParent(Entity entity, Class<T> classObj) throws ModelException {
		return getParent(entity, null, classObj);
	}

	public <T extends Entity> @Nullable T getParent(Entity entity, String kind, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.to(entity,kind).withPaging(0, 1);
		List<T> supers = list(q);
		if (!supers.isEmpty()) {
			return supers.get(0);
		} else {
			return null;
		}
	}

	public @Nullable <T extends Entity> T getChild(Entity entity, @NonNull Class<T> classObj) throws ModelException {
		return getChild(entity, null, classObj);
	}

	public <T extends Entity> @Nullable T getChild(Entity entity, String kind, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.from(entity,kind).withPaging(0, 1);
		List<T> supers = list(q);
		if (!supers.isEmpty()) {
			return supers.get(0);
		} else {
			return null;
		}
	}

	public User getUser(String username) {
		Session session = null;
		try {
			if (Strings.isBlank(username)) {
				log.warn("Empty user requested");
			} else {
				session = getSession();
				
				Query q = session.createQuery("from User as user left join fetch user.properties where lower(user.username)=lower(?)");
				q.setString(0, username);
				List<?> list = q.list();
				for (Object object : list) {
					User user = (User) object;
					if (user != null) {
						return getSubject(user);
					}					
				}
			}
		} catch (org.hibernate.exception.GenericJDBCException e) {
			boolean active = session!=null && session.getTransaction()!=null ? session.getTransaction().isActive() : false;
			log.error("Unable to get user: "+username+" / session.active="+active,e);
			Throwable cause = e.getCause();
			if (cause instanceof BatchUpdateException) {
				BatchUpdateException batchUpdateException = (BatchUpdateException) cause;
				SQLException nextException = batchUpdateException.getNextException();
				log.error("Next exception: "+nextException.getMessage(),e);
			}
			log.error("SQL: "+e.getSQL());
		}
		return null;
	}

	public Privilege getPriviledge(Item item, Privileged priviledged) {
		return getPriviledge(item, priviledged, getSession());
	}

	public Privilege getPriviledge(Item item, Privileged priviledged, Session session) {
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

	public List<Privilege> getPrivileges(Item item) {
		Query q = getSession().createQuery("from Privilege as priv where priv.object=:object");
		q.setLong("object", item.getId());
		List<Privilege> list = Code.castList(q.list());
		return list;
	}
	
	@SuppressWarnings("unchecked")
	public User getOwner(Item item) throws ModelException {
		Session session = getSession();
		Query q = session.createQuery("select user from User as user, Privilege as priv where priv.alter=true and priv.object=:object and priv.subject=user.id");
		q.setLong("object", item.getId());
		List<User> list = q.list();
		for (User user : list) {
			if (!SecurityService.PUBLIC_USERNAME.equals(user.getUsername())) {
				return user;
			}
		}
		return null;
	}

	public Privilege getPrivilege(long object, long subject) {
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

	public void removePriviledges(Item object, Privileged subject) {
		Session session = getSession();
		Query q = session.createQuery("delete from Privilege as priv where priv.object=:object and priv.subject=:subject");
		q.setLong("object", object.getId());
		q.setLong("subject", subject.getIdentity());
		int count = q.executeUpdate();
		log.info("Deleting privileges for: " + object.getClass().getName() + "; count: " + count);
	}

	@SuppressWarnings("unchecked")
	public List<Long> listIds(IdQuery query) {
		Query q = query.createIdQuery(getSession());
		List<Long> items = q.list();
		return items;
	}

	public <T> Results<T> scroll(ItemQuery<T> query) {
		Query q = query.createItemQuery(getSession()).setReadOnly(true).setFetchSize(0).setCacheable(false).setCacheMode(CacheMode.IGNORE);
		return new Results<T>(q.scroll(ScrollMode.FORWARD_ONLY));
	}
	
	@SuppressWarnings("unchecked")
	public List<Object[]> querySQL(String sql) throws ModelException {
		try {
			SQLQuery query = getSession().createSQLQuery(sql);
			return query.list();
		} catch (HibernateException e) {
			log.error(e.getMessage(),e);
		}
		return null;
	}

	public <T> List<T> list(CustomQuery<T> query) throws ModelException {
		try {
			SQLQuery sql = getSession().createSQLQuery(query.getSQL());
			query.setParameters(sql);
			List<?> list = sql.list();
			List<T> result = Lists.newArrayList();
			for (Object t : list) {
				if (t instanceof Object[]) {
					result.add(query.convert((Object[]) t));					
				} else {
					result.add(query.convert(new Object[] {t}));
				}
			}
			return result;
		} catch (SQLGrammarException e) {
			log.error("SQL:"+e.getSQL());
			throw new ModelException("Error executing SQL", e);
		} catch (HibernateException e) {
			
			throw new ModelException("Error executing SQL", e);
		}
	}

	@SuppressWarnings("unchecked")
	public <T> SearchResult<T> search(CustomQuery<T> query) throws ModelException {
		String sql = query.getSQL();
		try {
			int totalCount = count(query);

			SQLQuery sqlQuery = getSession().createSQLQuery(sql);
			query.setParameters(sqlQuery);

			List<Object[]> rows = sqlQuery.list();
			List<T> result = Lists.newArrayList();
			for (Object[] t : rows) {
				result.add(query.convert(t));
			}

			return new SearchResult<T>(result, totalCount);
		} catch (HibernateException e) {
			throw new ModelException("Error executing SQL: "+sql, e);
		}
	}

	public int count(CustomQuery<?> query) {

		String countSQL = query.getCountSQL();
		int totalCount = 0;
		if (countSQL!=null) {
			SQLQuery countSqlQuery = getSession().createSQLQuery(countSQL);
			query.setParameters(countSqlQuery);
			List<?> countRows = countSqlQuery.list();
			Object next = countRows.iterator().next();
			totalCount = ((Number) next).intValue();
		}
		return totalCount;
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
		return items;
	}

	@SuppressWarnings("unchecked")
	public <T> @Nullable T getFirst(ItemQuery<T> query) {
		Query q = query.createItemQuery(getSession());
		q.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
		Object result = q.uniqueResult();
		if (result!=null) {
			return (T) getSubject(result);
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	public <T> SearchResult<T> search(ItemQuery<T> query) {
		Query cq = query.createCountQuery(getSession());
		List<?> list = cq.list();
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

	public Long count(ItemQuery<?> query) {
		Query cq = query.createCountQuery(getSession());
		List<?> list = cq.list();
		Object next = list.iterator().next();
		return (Long) next;
	}

	@SuppressWarnings("unchecked")
	public <T,U> PairSearchResult<T,U> searchPairs(PairQuery<T,U> query) {
		Query cq = query.createCountQuery(getSession());
		List<Object> list = cq.list();
		Object next = list.iterator().next();
		Long count = (Long) next;
		Query q = query.createItemQuery(getSession());
		//q.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
		List<Pair<T, U>> map = new ArrayList<Pair<T, U>>();
		for (Iterator<Object> i = q.iterate(); i.hasNext();) {
			Object[] object = (Object[]) i.next();
			map.add(new Pair<T,U>((T)getSubject(object[0]), (U)getSubject(object[1])));
		}
		return new PairSearchResult<T,U>(map,count.intValue());
	}

	public void grantFullPrivileges(Item item, Privileged privileged) throws ModelException {
		grantPrivileges(item, privileged, true, true, true);
	}

	public void grantPrivileges(Item item, Privileged priviledged, boolean view, boolean alter, boolean delete) throws ModelException {
		if (priviledged==null) {
			throw new ModelException("Privileged is null");
		}
		if (priviledged.getIdentity()<1) {
			throw new ModelException("Privileged ID is "+priviledged.getIdentity());
		}
		if (item.isNew()) {
			throw new ModelException("The item is new so cannot grant privileges: identity="+priviledged.getIdentity());
		}
		Session session = getSession();
		Privilege privilege = getPrivilege(item.getId(), priviledged.getIdentity());
		if (privilege == null) {
			privilege = new Privilege(priviledged.getIdentity(), item.getId());
		}
		privilege.setAlter(alter);
		privilege.setDelete(delete);
		privilege.setView(view);
		session.save(privilege);
	}

	private void removeAllPrivileges(Item item) {
		
		
		Session session = getSession();
		Query query = session.createQuery("select user from User as user, Privilege as priv where priv.object=:object and priv.subject=user.id");
		query.setLong("object", item.getId());
		List<User> users = Code.castList(query.list());
		
		
		String hql = "delete Privilege p where p.object = :id";
		Query q = session.createQuery(hql);
		q.setLong("id", item.getId());
		int count = q.executeUpdate();
		log.info("Deleting privileges for: " + item.getClass().getName() + "; count: " + count);
		
		eventService.firePrivilegesRemoved(item,users);
	}

	public List<Entity> getChildren(Entity item, String relationKind, Privileged privileged) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<Entity> q = dk.in2isoft.onlineobjects.core.Query.of(Entity.class);
		q.from(item,relationKind);
		if (!privileged.isSuper()) {
			q.withPrivileged(privileged,securityService.getPublicUser());
		}
		return list(q);
	}

	/**
	 * Performance warning!
	 */
	public List<Entity> getChildren(Entity item, String relationKind) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<Entity> q = dk.in2isoft.onlineobjects.core.Query.of(Entity.class);
		q.from(item,relationKind);
		return list(q);
	}

	public <T> List<T> getChildren(Entity item, String relationKind, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.from(item,relationKind);
		return list(q);
	}

	public <T> List<T> getChildren(Entity item, String relationKind, Class<T> classObj, Privileged privileged) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.from(item,relationKind);
		if (!privileged.isSuper()) {
			q.withPrivileged(privileged,securityService.getPublicUser());
		}
		return list(q);
	}

	@Deprecated
	public <T> List<T> getChildren(Entity entity, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.from(entity);
		return list(q);
	}

	public <T> List<T> getChildren(Entity entity, Class<T> classObj, Privileged privileged) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.from(entity);
		if (!privileged.isSuper()) {
			q.withPrivileged(privileged,securityService.getPublicUser());
		}
		return list(q);
	}

	public <T> List<T> getChildrenOrdered(Entity entity, Class<T> classObj) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.from(entity).inPosition();
		return list(q);
	}

	public <T> List<T> getChildrenOrdered(Entity entity, Class<T> classObj, Privileged privileged) throws ModelException {
		dk.in2isoft.onlineobjects.core.Query<T> q = dk.in2isoft.onlineobjects.core.Query.of(classObj);
		q.from(entity).inPosition();
		q.withPrivileged(privileged);
		return list(q);
	}

	public Map<String, Float> getPropertyCloud(String key, String query, Class<? extends Entity> cls) {
		Map<String, Float> cloud = new LinkedHashMap<String, Float>();
		Session session = getSession();
		StringBuilder hql = new StringBuilder();
		hql.append("select p.value as value,count(p.id) as count from ");
		hql.append(cls.getSimpleName()).append(" as entity");
		hql.append(" left join entity.properties as p where p.key=:key");
		if (Strings.isNotBlank(query)) {
			hql.append(" and lower(value) like lower(:query)");
		}
		hql.append(" group by p.value order by lower(value)");
		Query q = session.createQuery(hql.toString());
		q.setString("key", key);
		if (Strings.isNotBlank(query)) {
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
		float min = max;
		for (Float count : cloud.values()) {
			min = Math.min(min, count);
		}
		for (Map.Entry<String, Float> entry : cloud.entrySet()) {
			entry.setValue(((entry.getValue()-min) / (max-min)));
		}
		return cloud;
	}
	
	public Map<String, Integer> getProperties(String key, Class<? extends Entity> cls, Privileged priviledged) {
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

	public Relation getRelation(Entity from, Entity to) {
		Session session = getSession();
		StringBuilder hql = new StringBuilder("from Relation as r ");
		hql.append(" where r.from.id=:from and r.to.id=:to");
		Query q = session.createQuery(hql.toString());
		q.setLong("from", from.getId());
		q.setLong("to", to.getId());
		List<Relation> list = list(q, Relation.class);
		if (list.size() > 0) {
			return getSubject(list.get(0));
		}
		return null;
	}

	public Relation getRelation(long id) {
		Session session = getSession();
		StringBuilder hql = new StringBuilder("from Relation as r where r.id=:id");
		Query q = session.createQuery(hql.toString());
		q.setLong("id", id);
		List<Relation> list = list(q, Relation.class);
		if (list.size() > 0) {
			return getSubject(list.get(0));
		}
		return null;
	}

	public Relation getRelation(Entity from, Entity to, String kind) {
		Session session = getSession();
		StringBuilder hql = new StringBuilder("from Relation as r ");
		hql.append(" where r.from.id=:from and r.to.id=:to and r.kind=:kind");
		Query q = session.createQuery(hql.toString());
		q.setLong("from", from.getId());
		q.setLong("to", to.getId());
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
		
		if (obj instanceof HibernateProxy) {
			obj = (T) ((AbstractLazyInitializer) ((HibernateProxy) obj).getHibernateLazyInitializer()).getImplementation();
		}
		if (obj==null) {
			log.error("The objects is null");
		}
		return obj;
	}

	public void setEventService(EventService eventService) {
		this.eventService = eventService;
	}

	public EventService getEventService() {
		return eventService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
