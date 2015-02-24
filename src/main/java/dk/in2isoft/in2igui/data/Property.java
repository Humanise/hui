package dk.in2isoft.in2igui.data;

public class Property {

	private String label;
	private String value;

	public Property() {
		
	}
	
	public Property(String label, String value) {
		this.label = label;
		this.value = value;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
