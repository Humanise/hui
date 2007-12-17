package dk.in2isoft.onlineobjects.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

public class Item {

	public static String NAMESPACE = "http://uri.onlineobjects.com/model/Item/";
	public static String TYPE = "Item";
	private Collection<Property> properties = new ArrayList<Property>();
	
	private long id;
	private Date created;

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
	
	public Collection<Property> getProperties() {
		return properties;
	}

	public void setProperties(Collection<Property> properties) {
		this.properties = properties;
	}
	
	public String getProperty(String key) {
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property element = iter.next();
			if (element.getKey().equals(key)) {
				return element.getValue();
			}
		}
		return null;
	}

	public void overrideFirstProperty(String key, String value) {
		boolean found = false;
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property element = iter.next();
			if (element.getKey().equals(key)) {
				element.setValue(value);
				found=true;
				break;
			}
		}
		if (!found) {
			properties.add(new Property(key,value));
		}
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}
}
