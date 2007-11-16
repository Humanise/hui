package dk.in2isoft.onlineobjects.model;

public class Property extends Item {

	private String key;
	private String value;

	public Property() {
		super();
	}

	public Property(String key,String value) {
		super();
		this.value = value;
		this.key = key;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
}
