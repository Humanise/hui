package dk.in2isoft.onlineobjects.core;

import org.hibernate.Query;
import org.hibernate.Session;

import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;

public class UserPersonQuery implements ItemMapQuery<User, Person> {

	private int pageNumber;
	private int pageSize;

	public UserPersonQuery withPaging(int pageNumber, int pageSize) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		return this;
	}
	
	public Query createItemMapQuery(Session session) {
		StringBuilder hql = new StringBuilder();
		hql.append("select user,person from ");
		//hql.append("user)
		return null;
	}

}
