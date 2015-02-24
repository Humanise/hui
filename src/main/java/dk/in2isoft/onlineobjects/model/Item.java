package dk.in2isoft.onlineobjects.model;

import java.util.Date;

public class Item {

	public static String NAMESPACE = "http://uri.onlineobjects.com/model/Item/";
	public static String TYPE = "Item";
	
	private long id;
	private Date created;
	private Date updated;

	public Item() {
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getIcon() {
		return "common/object";
	}

	public String getNamespace() {
		return NAMESPACE;
	}
	
	public boolean isNew() {
		return this.id==0;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public Date getUpdated() {
		return updated;
	}

	public void setUpdated(Date updated) {
		this.updated = updated;
	}

	@Override
	public String toString() {
		return getClass().getSimpleName()+" ("+this.id+")";
	}
}
