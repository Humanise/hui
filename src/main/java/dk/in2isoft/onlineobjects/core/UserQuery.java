package dk.in2isoft.onlineobjects.core;

import org.hibernate.Query;
import org.hibernate.Session;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.util.HQLBuilder;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class UserQuery implements PairQuery<User, Person> {
	
	private String username;
	private String[] words;
	private int pageNumber;
	private int pageSize;
	private Class<? extends Entity> childClass;
	private boolean publicView;

	public Query createCountQuery(Session session) {
		HQLBuilder hql = new HQLBuilder().select("count(person)");
		return createQuery(session, hql, true);
	}

	public Query createItemQuery(Session session) {
		HQLBuilder hql = new HQLBuilder().select("user","person");
		return createQuery(session, hql, false);
	}
	
	private Query createQuery(Session session,HQLBuilder hql, boolean ignorePaging) {
		hql.from(User.class,"user");
		hql.from(Person.class,"person");
		hql.from(Relation.class,"rel");
		if (publicView) {
			hql.from(Privilege.class,"userPrivilege");
			hql.from(User.class,"publicUser");
		}
		hql.where("rel.to=person");
		hql.where("rel.from=user");
		
		if (username!=null) {
			hql.where("user.username=:username");
		}
		if (Strings.isDefined(words)) {
			for (int i = 0; i < words.length; i++) {
				hql.where("(lower(person.name) like lower(:word" + i + ") or lower(user.name) like lower(:word" + i + "))");
			}
		}
		if (childClass!=null) {
			hql.where(" user.id = some ( select priv.subject from Privilege as priv,"+childClass.getName()+" as x where priv.object=x.id)");
		}
		if (publicView) {
			hql.where(" user.id = userPrivilege.object and userPrivilege.subject=publicUser.id and publicUser.username='public' and userPrivilege.view=true");
		}
		if (!ignorePaging) {
			hql.orderBy("person.name");
		}
		Query q = session.createQuery(hql.toString());
		if (pageSize > 0 && !ignorePaging) {
			q.setMaxResults(pageSize);
			q.setFirstResult(pageNumber * pageSize);
		}
		if (username!=null) {
			q.setString("username", username);
		}
		if (Strings.isDefined(words)) {
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

	public UserQuery withPublicView() {
		this.publicView = true;
		return this;
	}

	public UserQuery withWords(String query) {
		if (Strings.isNotBlank(query)) {
			words = Strings.getWords(query);
		}
		return this;
	}

	public UserQuery withPaging(int pageNumber, int pageSize) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		return this;
	}

	public UserQuery withUsersChildren(Class<? extends Entity> usersChildClass) {
		this.childClass = usersChildClass;
		return this;
	}

}
