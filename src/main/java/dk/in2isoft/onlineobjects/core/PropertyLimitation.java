package dk.in2isoft.onlineobjects.core;

public class PropertyLimitation {

	private Integer minimumOccurrence = 1;
	private Integer maximumOccurrence;
	private String key;
	private Object value;

	public Integer getMinimumOccurrence() {
		return minimumOccurrence;
	}

	public void setMinimumOccurrence(Integer minimumOccurrence) {
		this.minimumOccurrence = minimumOccurrence;
	}

	public Integer getMaximumOccurrence() {
		return maximumOccurrence;
	}

	public void setMaximumOccurrence(Integer maximumOccurrence) {
		this.maximumOccurrence = maximumOccurrence;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}
}
