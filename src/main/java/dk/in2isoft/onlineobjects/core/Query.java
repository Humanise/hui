package dk.in2isoft.onlineobjects.core;

import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.hibernate.Session;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.FieldLimitation.Function;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class Query<T> extends AbstractModelQuery<T> implements IdQuery, ItemQuery<T> {

	//private static Logger log = Logger.getLogger(Query.class);

	private boolean inPosition;

	private String ordering;
	
	private boolean descending;
	
	private boolean publicView;
	
	private List<Other> parents;
	private List<Other> children;
	

	public Query(Class<T> clazz) {
		super();
		this.clazz = clazz;
		this.parents = Lists.newArrayList();
		this.children = Lists.newArrayList();
	}

	public Query<T> orderByCreated() {
		ordering = "obj.created";
		return this;
	}

	public Query<T> orderByField(String field) {
		ordering = "obj."+field;
		return this;
	}

	public Query<T> orderByFieldLowercase(String field) {
		ordering = "lower(obj."+field+")";
		return this;
	}

	public Query<T> orderByName() {
		ordering = "obj.name";
		return this;
	}
	
	public Query<T> descending() {
		descending=true;
		return this;
	}
	
	public Query<T> descending(boolean descending) {
		this.descending=descending;
		return this;
	}
	
	public Query<T> ascending() {
		descending=false;
		return this;
	}

	public Query<T> withWords(String query) {
		if (Strings.isNotBlank(query)) {
			words = Strings.getWords(query);
		}
		return this;
	}
	
	public Query<T> withIds(Long... ids) {
		this.ids = ids;
		return this;
	}
	
	public Query<T> withIds(Collection<Long> ids) {
		this.ids = ids.toArray(new Long[] {});
		return this;
	}

	public Query<T> withName(Object value) {
		fieldLimitations
				.add(new FieldLimitation(Entity.FIELD_NAME, value, FieldLimitation.Comparison.EQUALS));
		return this;
	}

	public Query<T> withField(String property, Object value) {
		fieldLimitations.add(new FieldLimitation(property, value, FieldLimitation.Comparison.EQUALS));
		return this;
	}

	public Query<T> withFieldLowercase(String property, Object value) {
		FieldLimitation limitation = new FieldLimitation(property, value, FieldLimitation.Comparison.EQUALS);
		limitation.setFunction(Function.lower);
		fieldLimitations.add(limitation);
		return this;
	}

	public Query<T> withFieldLike(String property, String str) {
		fieldLimitations.add(new FieldLimitation(property, str, FieldLimitation.Comparison.LIKE));
		return this;
	}

	public Query<T> withFieldLowercaseLike(String property, String str) {
		FieldLimitation limitation = new FieldLimitation(property, str, FieldLimitation.Comparison.LIKE);
		limitation.setFunction(FieldLimitation.Function.lower);
		fieldLimitations.add(limitation);
		return this;
	}

	public Query<T> withFieldIn(String property, Object[] value) {
		fieldLimitations.add(new FieldLimitation(property, value, FieldLimitation.Comparison.IN));
		return this;
	}

	public Query<T> withLowercaseFieldIn(String property, Object[] value) {
		FieldLimitation limitation = new FieldLimitation(property, value, FieldLimitation.Comparison.IN);
		limitation.setFunction(FieldLimitation.Function.lower);
		fieldLimitations.add(limitation);
		return this;
	}

	public Query<T> withFieldIn(String property, List<?> value) {
		fieldLimitations.add(new FieldLimitation(property, value, FieldLimitation.Comparison.IN));
		return this;
	}

	public Query<T> withFieldMoreThan(String property, Object value) {
		fieldLimitations.add(new FieldLimitation(property, value, FieldLimitation.Comparison.MORETHAN));
		return this;
	}

	public Query<T> withFieldLessThan(String property, Object value) {
		fieldLimitations.add(new FieldLimitation(property, value, FieldLimitation.Comparison.LESSTHAN));
		return this;
	}

	public Query<T> withCustomProperty(String key, Object value) {
		PropertyLimitation limitation = new PropertyLimitation();
		limitation.setKey(key);
		limitation.setValue(value);
		customProperties.add(limitation);
		return this;
	}

	public Query<T> withPrivileged(Privileged... privileged) {
		if (privileged==null || privileged.length==1 && privileged[0]==null) {
			this.privileged = null;
		}
		else {
			this.privileged = privileged;
		}
		return this;
	}

	public Query<T> withPublicView() {
		this.publicView = true;
		return this;
	}

	public Query<T> withPaging(int pageNumber, int pageSize) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		return this;
	}

	public Query<T> withCreatedFrom(Date date) {
		createdFrom = date;
		return this;
	}

	public Query<T> withCreatedTo(Date date) {
		createdTo = date;
		return this;
	}

	public Query<T> withParent(Entity entity) {
		//super.parent = entity;
		this.parents.add(new Other(entity,null));
		return this;
	}

	public Query<T> withParents(List<? extends Entity> entities) {
		for (Entity entity : entities) {
			this.parents.add(new Other(entity,null));			
		}
		return this;
	}

	public Query<T> withParentIds(List<Long> ids) {
		for (Long id : ids) {
			this.parents.add(new Other(id,null));
		}
		return this;
	}

	public Query<T> withParent(Entity item, String relationKind) {
		parentKind = relationKind;
		this.parents.add(new Other(item,relationKind));
		return this;
	}

	public Query<T> withChildren(List<? extends Entity> entities) {
		for (Entity entity : entities) {
			this.children.add(new Other(entity,null));			
		}
		return this;
	}

	public Query<T> withChild(Entity entity) {
		super.child = entity;
		return this;
	}
	
	public Query<T> withChild(Long id, String kind) {
		children.add(new Other(id, kind));
		return this;
	}


	public Query<T> withChild(Entity item, String relationKind) {
		child = item;
		childKind = relationKind;
		return this;
	}

	public static <E> Query<E> of(Class<E> className) {
		return new Query<E>(className);
	}

	public static <E> Query<E> after(Class<E> className) {
		return new Query<E>(className);
	}

	public org.hibernate.Query createItemQuery(Session session) {
		StringBuilder hql = new StringBuilder("select obj");
		return createQuery(hql, session, false);
	}

	public org.hibernate.Query createCountQuery(Session session) {
		StringBuilder hql = new StringBuilder("select count(distinct obj.id)");
		return createQuery(hql, session, true);
	}

	public org.hibernate.Query createIdQuery(Session session) {
		StringBuilder hql = new StringBuilder("select obj.id");
		return createQuery(hql, session, true);
	}

	private org.hibernate.Query createQuery(StringBuilder hql, Session session, boolean ignorePaging) {

		hql.append(" from ");
		hql.append(clazz.getName());
		hql.append(" as obj");
		if (privileged != null && privileged.length>0) {
			hql.append(",").append(Privilege.class.getName()).append(" as priv");
		}
		if (publicView) {
			hql.append(",").append(Privilege.class.getName()).append(" as publicPrivilege");
			hql.append(",").append(User.class.getName()).append(" as publicUser");
		}
		//if (parent != null) {
		//	hql.append(",").append(Relation.class.getName()).append(" as parentrel");
		//}
		for (int i = 0; i < parents.size(); i++) {
			hql.append(",").append(Relation.class.getName()).append(" as parentrel_"+i);
		}
		for (int i = 0; i < children.size(); i++) {
			hql.append(",").append(Relation.class.getName()).append(" as childrel_"+i);
		}
		if (child != null) {
			hql.append(",").append(Relation.class.getName()).append(" as childRelation");
		}
		if (!ignorePaging && Entity.class.isAssignableFrom(clazz)) {
			//hql.append(" left join fetch obj.properties");
		}
		if (Strings.isDefined(words) && Entity.class.isAssignableFrom(clazz) || customProperties.size() > 0) {
			hql.append(" left join obj.properties as p");
		}
		/*
		if (parent != null) {
			// TODO is this necessary
			// hql.append(" left join parentrel.superEntity as parentSuper");
			// hql.append(" left join parentrel.subEntity as parentSub");
		}*/
		if (child != null) {
			// TODO is this necessary
			hql.append(" left join childRelation.superEntity as childSuper");
			hql.append(" left join childRelation.subEntity as childSub");
		}
		hql.append(" where obj.id>0");
		if (Strings.isDefined(words)) {
			for (int i = 0; i < words.length; i++) {
				hql.append(" and (lower(obj.name) like lower(:word" + i + ") or lower(p.value) like lower(:word" + i
						+ "))");
			}
		}
		if (ids!=null && ids.length>0) {
			hql.append(" and (");
			for (int i = 0; i < ids.length; i++) {
				if (i>0) {
					hql.append(" or ");
				}
				hql.append("obj.id=").append(ids[i]);
			}
			hql.append(")");
		}
		if (customProperties.size() > 0) {
			hql.append(" and p.key=:propertyKey and p.value=:propertyValue");
		}
		if (fieldLimitations.size() > 0) {
			for (FieldLimitation limit : fieldLimitations) {
				if (limit.getComparison().equals(FieldLimitation.Comparison.IN)) {
					hql.append(" and ");
					if (limit.getFunction()!=null) {
						hql.append(limit.getFunction().name()).append("(");
					}
					hql.append(limit.getProperty());
					if (limit.getFunction()!=null) {
						hql.append(")");
					}
					hql.append(limit.getComparison());
					hql.append("(:").append(limit.getProperty()).append(")");
				} else {
					hql.append(" and ");
					if (limit.getFunction()!=null) {
						hql.append(limit.getFunction().name()).append("(");
					}
					hql.append(limit.getProperty());
					if (limit.getFunction()!=null) {
						hql.append(")");
					}
					hql.append(limit.getComparison());
					hql.append(":").append(limit.getProperty());
				}
			}
		}
		for (int i = 0; i < parents.size(); i++) {
			hql.append(" and parentrel_").append(i).append(".superEntity=:parent_").append(i).append(" and parentrel_").append(i).append(".subEntity=obj");
			if (parents.get(i).getRelationKind() != null) {
				hql.append(" and parentrel_").append(i).append(".kind=:parentKind_").append(i);
			}
		}
		for (int i = 0; i < children.size(); i++) {
			hql.append(" and childrel_").append(i).append(".subEntity=:child_").append(i).append(" and childrel_").append(i).append(".superEntity=obj");
			if (children.get(i).getRelationKind() != null) {
				hql.append(" and childrel_").append(i).append(".kind=:childKind_").append(i);
			}
		}
		/*
		if (parent != null) {
			hql.append(" and parentrel.superEntity=:parent and parentrel.subEntity=obj");
			if (parentKind != null) {
				hql.append(" and parentrel.kind=:parentKind");
			}
		}*/
		if (child != null) {
			hql.append(" and childSuper.id=obj.id and childSub.id=:child");
			if (childKind != null) {
				hql.append(" and childRelation.kind=:childKind");
			}
		}
		if (privileged!=null && privileged.length>0) {
			hql.append(" and obj.id = priv.object and (");
			for (int i = 0; i < privileged.length; i++) {
				if (i>0) {
					hql.append(" or ");
				}
				hql.append("priv.subject=").append(privileged[i].getIdentity());
				
			}
			hql.append(")");
		}
		if (publicView) {
			hql.append(" and obj.id = publicPrivilege.object and publicPrivilege.subject=publicUser.id and publicUser.username='public' and publicPrivilege.view=true");
		}
		if (createdFrom != null) {
			hql.append(" and obj.created>=:createdFrom");
		}
		if (createdTo != null) {
			hql.append(" and obj.created<=:createdTo");
		}
		if (!ignorePaging) {
			if (parents.size()==1 && inPosition) {
				hql.append(" order by parentrel_0.position");
				hql.append(descending ? " desc" : " asc");
			} else if (child != null && inPosition) {
				hql.append(" order by childRelation.position");
				hql.append(descending ? " desc" : " asc");
			} else if (Strings.isNotBlank(ordering)) {
				hql.append(" order by ").append(ordering);
				hql.append(descending ? " desc" : " asc");
			} else if (Entity.class.isAssignableFrom(clazz)) {
				hql.append(" order by obj.name");
				hql.append(descending ? " desc" : " asc");
			}
		}
		//log.info(hql);
		org.hibernate.Query q = session.createQuery(hql.toString());
		if (pageSize > 0 && !ignorePaging) {
			q.setMaxResults(pageSize);
			q.setFetchSize(pageSize);
			q.setFirstResult(pageNumber * pageSize);
		}
		for (Iterator<FieldLimitation> i = fieldLimitations.iterator(); i.hasNext();) {
			FieldLimitation limit = i.next();
			Object value = limit.getValue();
			if (value instanceof Date) {
				q.setDate(limit.getProperty(), (Date) limit.getValue());
			} else if (value instanceof List<?>) {
				q.setParameterList(limit.getProperty(), (List<?>) limit.getValue());
			} else if (value instanceof Object[]) {
				q.setParameterList(limit.getProperty(), (Object[]) limit.getValue());
			} else {
				q.setString(limit.getProperty(), value==null ? null : value.toString());
			}
		}
		if (Strings.isDefined(words)) {
			for (int i = 0; i < words.length; i++) {
				String word = words[i];
				q.setString("word" + i, "%" + word + "%");
			}
		}
		if (customProperties.size() > 0) {
			// TODO: more than one property
			PropertyLimitation entry = customProperties.iterator().next();
			q.setString("propertyKey", entry.getKey());
			q.setString("propertyValue", entry.getValue().toString());
		}
		if (createdFrom != null) {
			q.setDate("createdFrom", createdFrom);
		}
		if (createdTo != null) {
			q.setDate("createdTo", createdTo);
		}
		for (int i = 0; i < parents.size(); i++) {
			Other parent2 = parents.get(i);
			q.setLong("parent_"+i, parent2.getId());
			if (parent2.getRelationKind() != null) {
				q.setString("parentKind_"+i, parent2.getRelationKind());
			}
		}
		for (int i = 0; i < children.size(); i++) {
			Other other = children.get(i);
			q.setLong("child_"+i, other.getId());
			if (other.getRelationKind() != null) {
				q.setString("childKind_"+i, other.getRelationKind());
			}
		}
		/*if (parent != null) {
			q.setLong("parent", parent.getId());
			if (parentKind != null) {
				q.setString("parentKind", parentKind);
			}
		}*/
		if (child != null) {
			q.setLong("child", child.getId());
			if (childKind != null) {
				q.setString("childKind", childKind);
			}
		}
		return q;
	}

	public void inPosition() {
		inPosition = true;
	}
	
	private class Other {
		String relationKind;
		private long id;
		
		public Other(long id,String relationKind) {
			this.id = id;
			this.relationKind = relationKind;
		}
		
		public Other(Entity item,String relationKind) {
			this.id = item.getId();
			this.relationKind = relationKind;
		}
		
		public long getId() {
			return id;
		}
		
		public String getRelationKind() {
			return relationKind;
		}
	}

}
