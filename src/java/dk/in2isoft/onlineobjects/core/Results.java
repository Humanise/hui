package dk.in2isoft.onlineobjects.core;

import org.hibernate.ScrollableResults;

public class Results<T> {

	private ScrollableResults results;

	protected Results(ScrollableResults results) {
		this.results = results;
	}
	
	public boolean next() {
		return results.next();
	}
	
	@SuppressWarnings("unchecked")
	public T get() {
		T object = (T) results.get(0);
		return ModelService.getSubject(object);
	}
	
	public void close() {
		results.close();
	}
}
