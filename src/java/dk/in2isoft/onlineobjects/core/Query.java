package dk.in2isoft.onlineobjects.core;

import java.util.Date;
import java.util.Iterator;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.hibernate.Session;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Relation;

public class Query<T> extends AbstractModelQuery<T> implements IdQuery, ItemQuery<T> {

	private static Logger log = Logger.getLogger(Query.class);

	private boolean inPosition;

	private String ordering;
	
	private boolean descending;

	public Query(Class<T> clazz) {
		super();
		this.clazz = clazz;
	}

	public Query<T> orderByCreated() {
		ordering = "created";
		return this;
	}

	public Query<T> orderByName() {
		ordering = "name";
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
		if (LangUtil.isDefined(query)) {
			words = LangUtil.getWords(query);
		}
		return this;
	}

	public Query<T> withName(Object value) {
		limitations
				.add(new ModelPropertyLimitation(Entity.FIELD_NAME, value, ModelPropertyLimitation.Comparison.EQUALS));
		return this;
	}

	public Query<T> withFieldValue(String property, Object value) {
		limitations.add(new ModelPropertyLimitation(property, value, ModelPropertyLimitation.Comparison.EQUALS));
		return this;
	}

	public Query<T> withFieldValueMoreThan(String property, Object value) {
		limitations.add(new ModelPropertyLimitation(property, value, ModelPropertyLimitation.Comparison.MORETHAN));
		return this;
	}

	public Query<T> withFieldValueLessThan(String property, Object value) {
		limitations.add(new ModelPropertyLimitation(property, value, ModelPropertyLimitation.Comparison.LESSTHAN));
		return this;
	}

	public Query<T> withCustomProperty(String key, Object value) {
		customProperties.put(key, value);
		return this;
	}

	public Query<T> withPriviledged(Priviledged priviledged) {
		this.priviledged = priviledged;
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
		super.parent = entity;
		return this;
	}

	public Query<T> withParent(Entity item, String relationKind) {
		parent = item;
		parentKind = relationKind;
		return this;
	}

	public Query<T> withChild(Entity entity) {
		super.child = entity;
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

	public org.hibernate.Query createItemQuery(Session session) {
		StringBuilder hql = new StringBuilder("select obj");
		return createQuery(hql, session, false);
	}

	public org.hibernate.Query createCountQuery(Session session) {
		StringBuilder hql = new StringBuilder("select count(obj)");
		return createQuery(hql, session, true);
	}

	public org.hibernate.Query createIdQuery(Session session) {
		StringBuilder hql = new StringBuilder("select obj.id");
		return createQuery(hql, session, false);
	}

	private org.hibernate.Query createQuery(StringBuilder hql, Session session, boolean ignorePaging) {

		hql.append(" from ");
		hql.append(clazz.getName());
		hql.append(" as obj");
		if (priviledged != null) {
			hql.append(",").append(Privilege.class.getName()).append(" as priv");
		}
		if (parent != null) {
			hql.append(",").append(Relation.class.getName()).append(" as parentrel");
		}
		if (child != null) {
			hql.append(",").append(Relation.class.getName()).append(" as childRelation");
		}
		if (!ignorePaging) {
			hql.append(" left join fetch obj.properties");
		}
		if (LangUtil.isDefined(words) && Entity.class.isAssignableFrom(clazz) || customProperties.size() > 0) {
			hql.append(" left join obj.properties as p");
		}
		if (parent != null) {
			// TODO is this necessary
			// hql.append(" left join parentrel.superEntity as parentSuper");
			// hql.append(" left join parentrel.subEntity as parentSub");
		}
		if (child != null) {
			// TODO is this necessary
			hql.append(" left join childRelation.superEntity as childSuper");
			hql.append(" left join childRelation.subEntity as childSub");
		}
		hql.append(" where obj.id>0");
		if (LangUtil.isDefined(words)) {
			for (int i = 0; i < words.length; i++) {
				hql.append(" and (lower(obj.name) like lower(:word" + i + ") or lower(p.value) like lower(:word" + i
						+ "))");
			}
		}
		if (customProperties.size() > 0) {
			hql.append(" and p.key=:propertyKey and p.value=:propertyValue");
		}
		if (limitations.size() > 0) {
			for (ModelPropertyLimitation limit : limitations) {
				hql.append(" and ").append(limit.getProperty());
				hql.append(limit.getComparison());
				hql.append(":").append(limit.getProperty());
			}
		}
		if (parent != null) {
			hql.append(" and parentrel.superEntity=:parent and parentrel.subEntity=obj");
			if (parentKind != null) {
				hql.append(" and parentrel.kind=:parentKind");
			}
		}
		if (child != null) {
			hql.append(" and childSuper.id=obj.id and childSub.id=:child");
			if (childKind != null) {
				hql.append(" and childRelation.kind=:childKind");
			}
		}
		if (priviledged != null) {
			hql.append(" and obj.id = priv.object and priv.subject=").append(priviledged.getIdentity());
		}
		if (createdFrom != null) {
			hql.append(" and obj.created>=:createdFrom");
		}
		if (createdTo != null) {
			hql.append(" and obj.created<=:createdTo");
		}
		if (!ignorePaging) {
			if (parent != null && inPosition) {
				hql.append(" order by parentrel.position");
				hql.append(descending ? " desc" : " asc");
			} else if (child != null && inPosition) {
				hql.append(" order by childRelation.position");
				hql.append(descending ? " desc" : " asc");
			} else if (LangUtil.isDefined(ordering)) {
				hql.append(" order by ").append(ordering);
				hql.append(descending ? " desc" : " asc");
			} else if (Entity.class.isAssignableFrom(clazz)) {
				hql.append(" order by obj.name");
				hql.append(descending ? " desc" : " asc");
			}
		}
		log.debug(hql);
		org.hibernate.Query q = session.createQuery(hql.toString());
		if (pageSize > 0 && !ignorePaging) {
			q.setMaxResults(pageSize);
			q.setFirstResult(pageNumber * pageSize);
		}
		for (Iterator<ModelPropertyLimitation> i = limitations.iterator(); i.hasNext();) {
			ModelPropertyLimitation limit = i.next();
			Object value = limit.getValue();
			if (value instanceof Date) {
				q.setDate(limit.getProperty(), (Date) limit.getValue());
			} else {
				q.setString(limit.getProperty(), limit.getValue().toString());
			}
		}
		if (LangUtil.isDefined(words)) {
			for (int i = 0; i < words.length; i++) {
				String word = words[i];
				q.setString("word" + i, "%" + word + "%");
			}
		}
		if (customProperties.size() > 0) {
			// TODO: more than one property
			Entry<String, Object> entry = customProperties.entrySet().iterator().next();
			q.setString("propertyKey", entry.getKey());
			q.setString("propertyValue", entry.getValue().toString());
		}
		if (createdFrom != null) {
			q.setDate("createdFrom", createdFrom);
		}
		if (createdTo != null) {
			q.setDate("createdTo", createdTo);
		}
		if (parent != null) {
			q.setLong("parent", parent.getId());
			if (parentKind != null) {
				q.setString("parentKind", parentKind);
			}
		}
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
}
