package dk.in2isoft.onlineobjects.core;

public class ModelPropertyLimitation {

	private String property;
	private Object value;
	
	public ModelPropertyLimitation(String property, Object value) {
		super();
		this.property = property;
		this.value = value;
	}
	
	public String getProperty() {
		return property;
	}
	public void setProperty(String property) {
		this.property = property;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
}
