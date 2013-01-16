package dk.in2isoft.onlineobjects.ui.jsf.model;

import javax.faces.model.SelectItem;

public class Option extends SelectItem {

	private static final long serialVersionUID = 1L;

	private boolean selected;
	private boolean disabled;
	
	private String key;

	public Option(Object value, String label) {
		super(value, label);
	}
	
	public Option() {
		
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}
	
	public boolean isSelected() {
		return selected;
	}
	
	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
	}
	
	public boolean isDisabled() {
		return disabled;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
}
