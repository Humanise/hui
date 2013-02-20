package dk.in2isoft.onlineobjects.core;

import org.hibernate.ScrollableResults;

import dk.in2isoft.commons.lang.Code;

public class Results<T> {

	private ScrollableResults results;

	protected Results(ScrollableResults results) {
		this.results = results;
	}
	
	public boolean next() {
		return results.next();
	}
	
	public T get() {
		T object = Code.cast(results.get(0));
		return ModelService.getSubject(object);
	}
	
	public void close() {
		results.close();
	}
}
