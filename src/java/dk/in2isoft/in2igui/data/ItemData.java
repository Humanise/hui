package dk.in2isoft.in2igui.data;

public class ItemData {
	private String title;
	private long id;
	private String icon;
	private String value;
	private String badge;
	private String kind;
	
	public ItemData() {
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public void setBadge(String badge) {
		this.badge = badge;
	}
	public String getBadge() {
		return badge;
	}
	public void setKind(String kind) {
		this.kind = kind;
	}
	public String getKind() {
		return kind;
	}
}
