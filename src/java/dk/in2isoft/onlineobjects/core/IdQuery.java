package dk.in2isoft.onlineobjects.core;

import org.hibernate.Session;

public interface IdQuery {

	public org.hibernate.Query createIdQuery(Session session);
}
