package dk.in2isoft.onlineobjects.core;

public class SimpleModelQuery extends AbstractModelQuery {

	public SimpleModelQuery(Class<?> clazz) {
		super();
		this.clazz = clazz;
	}
	
	public AbstractModelQuery addLimitation(String property,Object value) {
		limitations.add(new ModelPropertyLimitation(property,value));
		return this;
	}
}
