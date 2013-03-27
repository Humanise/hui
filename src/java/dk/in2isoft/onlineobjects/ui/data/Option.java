package dk.in2isoft.onlineobjects.ui.data;

public class Option {

	private String label;
	private Object value;
	
	public Option() {
		
	}
	
	public Option(String label, Object value) {
		super();
		this.label = label;
		this.value = value;
	}

	public String getLabel() {
		return label;
	}
	
	public void setLabel(String label) {
		this.label = label;
	}
	
	public Object getValue() {
		return value;
	}
	
	public void setValue(Object value) {
		this.value = value;
	}

	public static Option of(String label, Object value) {
		return new Option(label, value);
	}
}
