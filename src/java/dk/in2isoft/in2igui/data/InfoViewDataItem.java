package dk.in2isoft.in2igui.data;

public class InfoViewDataItem {

	private String type;
	private String label;
	private Object value;
	
	public InfoViewDataItem(String type, String label, Object value) {
		super();
		this.label = label;
		this.type = type;
		this.value = value;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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
	
	
}
