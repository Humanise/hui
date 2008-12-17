package dk.in2isoft.onlineobjects.core;

import org.hibernate.Session;

public interface ItemMapQuery<K,V> {

	public org.hibernate.Query createItemMapQuery(Session session);
}
