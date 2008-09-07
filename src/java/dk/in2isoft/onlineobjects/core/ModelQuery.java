package dk.in2isoft.onlineobjects.core;

import org.hibernate.Query;
import org.hibernate.Session;

public interface ModelQuery {

	public Query createItemQuery(Session session);
}
