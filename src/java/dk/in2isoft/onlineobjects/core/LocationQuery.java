package dk.in2isoft.onlineobjects.core;

import org.hibernate.Query;
import org.hibernate.Session;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.model.Relation;

public class  LocationQuery<T extends Entity> implements PairQuery<Location, T> {
	
	private String[] words;
	private int pageNumber;
	private int pageSize;
	private Class<T> cls;
	
	public LocationQuery(Class<T> cls) {
		this.cls = cls;
	}

	public Query createCountQuery(Session session) {
		StringBuilder hql = new StringBuilder("select count(location) from ");
		return createQuery(session, hql, true);
	}

	public Query createItemQuery(Session session) {
		StringBuilder hql = new StringBuilder("select location,entity from ");
		return createQuery(session, hql, false);
	}
	
	public Query createQuery(Session session,StringBuilder hql, boolean ignorePaging) {
		hql.append(Location.class.getName()).append(" as location");
		hql.append(",").append(cls.getName()).append(" as entity");
		hql.append(",").append(Relation.class.getName()).append(" as rel");
		hql.append(" where rel.subEntity=entity and rel.superEntity=location");
		if (LangUtil.isDefined(words)) {
			for (int i = 0; i < words.length; i++) {
				hql.append(" and (lower(entity.name) like lower(:word" + i + ") or lower(location.name) like lower(:word" + i + "))");
			}
		}
		if (!ignorePaging) {
			hql.append(" order by entity.name");
		}
		Query q = session.createQuery(hql.toString());
		if (pageSize > 0 && !ignorePaging) {
			q.setMaxResults(pageSize);
			q.setFirstResult(pageNumber * pageSize);
		}
		if (LangUtil.isDefined(words)) {
			for (int i = 0; i < words.length; i++) {
				String word = words[i];
				q.setString("word" + i, "%" + word + "%");
			}
		}
		return q;
	}

	public LocationQuery<T> withWords(String query) {
		if (LangUtil.isDefined(query)) {
			words = LangUtil.getWords(query);
		}
		return this;
	}

	public LocationQuery<T> withPaging(int pageNumber, int pageSize) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		return this;
	}

}
