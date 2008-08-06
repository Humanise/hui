package dk.in2isoft.onlineobjects.core;

public class ModelPropertyLimitation {

	public enum Comparison {
		EQUALS ("="), LESSTHAN ("<"), MORETHAN (">");
		
		private String x;
		Comparison(String x) {
			this.x = x;
		}
	
		public String toString() {
			return x;
		}
	};
	
	private String property;
	private Object value;
	private Comparison comparison;
	
	public ModelPropertyLimitation(String property, Object value, Comparison comparison) {
		super();
		this.property = property;
		this.value = value;
		this.comparison = comparison;
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
	
	public Comparison getComparison() {
		return comparison;
	}
}
