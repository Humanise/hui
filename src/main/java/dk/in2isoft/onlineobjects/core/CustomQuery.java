package dk.in2isoft.onlineobjects.core;

import org.hibernate.SQLQuery;


public interface CustomQuery<T> {

	public String getSQL();
	
	public String getCountSQL();

	public T convert(Object[] row);

	public void setParameters(SQLQuery sql);
}
