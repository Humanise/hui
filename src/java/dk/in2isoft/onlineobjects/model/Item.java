package dk.in2isoft.onlineobjects.model;

public class Item {

	public static String NAMESPACE = "http://uri.onlineobjects.com/model/Item/";
	public static String TYPE = "Item";
	
	private long id;

	public Item() {
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getIcon() {
		return "Element/Generic";
	}

	public String getNamespace() {
		return NAMESPACE;
	}
	
	public boolean isNew() {
		return this.id==0;
	}
}
