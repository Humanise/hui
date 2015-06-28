package dk.in2isoft.onlineobjects.ui.jsf.model;

import javax.faces.model.SelectItem;

public class Option extends SelectItem implements dk.in2isoft.in2igui.data.Option {

	private static final long serialVersionUID = 1L;

	private boolean selected;
	private boolean disabled;
	
	private String key;
	private String icon;
	private String badge;

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

	@Override
	public String getText() {
		return getLabel();
	}

	@Override
	public String getIcon() {
		return icon;
	}
	
	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getBadge() {
		return badge;
	}

	public void setBadge(String badge) {
		this.badge = badge;
	}
	
	
}
