package dk.in2isoft.onlineobjects.core;

import org.hibernate.Session;

public interface ItemQuery<T> {

	public org.hibernate.Query createItemQuery(Session session);
	public org.hibernate.Query createCountQuery(Session session);
}
