package dk.in2isoft.onlineobjects.core;

import org.hibernate.Query;
import org.hibernate.Session;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class UserQuery implements PairQuery<User, Person> {
	
	private String username;
	private String[] words;
	private int pageNumber;
	private int pageSize;

	public Query createCountQuery(Session session) {
		StringBuilder hql = new StringBuilder("select count(person) from ");
		return createQuery(session, hql, true);
	}

	public Query createItemQuery(Session session) {
		StringBuilder hql = new StringBuilder("select user,person from ");
		return createQuery(session, hql, false);
	}
	
	public Query createQuery(Session session,StringBuilder hql, boolean ignorePaging) {
		hql.append(User.class.getName()).append(" as user");
		hql.append(",").append(Person.class.getName()).append(" as person");
		hql.append(",").append(Relation.class.getName()).append(" as rel");
		hql.append(" where rel.subEntity=person and rel.superEntity=user");
		if (username!=null) {
			hql.append(" and user.username=:username");
		}
		if (LangUtil.isDefined(words)) {
			for (int i = 0; i < words.length; i++) {
				hql.append(" and (lower(person.name) like lower(:word" + i + ") or lower(user.name) like lower(:word" + i + "))");
			}
		}
		if (!ignorePaging) {
			hql.append(" order by person.name");
		}
		Query q = session.createQuery(hql.toString());
		if (pageSize > 0 && !ignorePaging) {
			q.setMaxResults(pageSize);
			q.setFirstResult(pageNumber * pageSize);
		}
		if (username!=null) {
			q.setString("username", username);
		}
		if (LangUtil.isDefined(words)) {
			for (int i = 0; i < words.length; i++) {
				String word = words[i];
				q.setString("word" + i, "%" + word + "%");
			}
		}
		return q;
	}

	public UserQuery withUsername(String username) {
		this.username = username;
		return this;
	}

	public UserQuery withWords(String query) {
		if (LangUtil.isDefined(query)) {
			words = LangUtil.getWords(query);
		}
		return this;
	}

	public UserQuery withPaging(int pageNumber, int pageSize) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		return this;
	}

}
