package dk.in2isoft.onlineobjects.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;


public class Entity extends Item {

	public static String NAMESPACE = Item.NAMESPACE+"Entity/";
	public static String TYPE = Item.TYPE+"/Entity";
	
	protected String name;
	private Collection<Property> properties = new ArrayList<Property>();

	public Entity() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
	
	@Override
	public String getNamespace() {
		return NAMESPACE;
	}

	@Override
	public String getIcon() {
		return "Element/Generic";
	}

	public String getType() {
		return TYPE;
	}
}
