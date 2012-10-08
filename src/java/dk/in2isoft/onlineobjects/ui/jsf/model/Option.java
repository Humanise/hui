package dk.in2isoft.onlineobjects.ui.jsf.model;

import javax.faces.model.SelectItem;

public class Option extends SelectItem {

	private static final long serialVersionUID = 1L;

	private boolean selected;
	private boolean disabled;

	public Option(String value, String label) {
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
}
