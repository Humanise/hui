package dk.in2isoft.onlineobjects.apps.desktop;

public class WindowProperty {

	private String badge;
	private String value;
	private String url;
	private long entityId;
	
	public WindowProperty() {
		super();
	}
	public WindowProperty(String badge,String value) {
		super();
		this.badge = badge;
		this.value = value;
	}

	public String getBadge() {
		return badge;
	}

	public void setBadge(String badge) {
		this.badge = badge;
	}

	public long getEntityId() {
		return entityId;
	}

	public void setEntityId(long entityId) {
		this.entityId = entityId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

}
