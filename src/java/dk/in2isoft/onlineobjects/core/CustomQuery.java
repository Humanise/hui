package dk.in2isoft.onlineobjects.core;


public interface CustomQuery<T> {

	public String getSQL();
	
	public String getCountSQL();

	public T convert(Object[] row);
}
