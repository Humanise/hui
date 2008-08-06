package dk.in2isoft.in2igui.data;

public class ObjectData {
	private String title;
	private long id;
	private String icon;
	
	public ObjectData(long id, String title) {
		this.id = id;
		this.title = title;
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
	
	
}
