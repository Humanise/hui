package dk.in2isoft.onlineobjects.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import dk.in2isoft.onlineobjects.model.annotations.Appearance;


@Appearance(icon="common/object")
public class Entity extends Item {

	public static String NAMESPACE = Item.NAMESPACE+"Entity/";
	public static String TYPE = Item.TYPE+"/Entity";
	public static final String FIELD_NAME = "name";
	
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
	
	@Override
	public String getNamespace() {
		return NAMESPACE;
	}

	@Override
	public String getIcon() {
		return "common/object";
	}

	public String getType() {
		return TYPE;
	}

	@Override
	public String toString() {
		return getClass().getSimpleName()+" ("+this.getId()+") : "+this.name;
	}
	
	public Collection<Property> getProperties() {
		return properties;
	}

	public void setProperties(Collection<Property> properties) {
		this.properties = properties;
	}
	
	public String getPropertyValue(String key) {
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property element = iter.next();
			if (element!=null && element.getKey().equals(key)) {
				return element.getValue();
			}
		}
		return null;
	}
	
	public boolean getPropertyBooleanValue(String key) {
		return "true".equals(getPropertyValue(key));
	}
	
	public Date getPropertyDateValue(String key) {
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property element = iter.next();
			if (element!=null && element.getKey().equals(key)) {
				return element.getDateValue();
			}
		}
		return null;
	}
	
	public Double getPropertyDoubleValue(String key) {
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property element = iter.next();
			if (element!=null && element.getKey().equals(key)) {
				return element.getDoubleValue();
			}
		}
		return null;
	}
	
	public Collection<Property> getProperties(String key) {
		Collection<Property> props = new ArrayList<Property>();
		for (Property property : properties) {
			if (key.equals(property.getKey())) {
				props.add(property);
			}
		}
		return props;
	}
	
	public List<String> getPropertyValues(String key) {
		List<String> props = new ArrayList<String>();
		for (Property property : properties) {
			if (property!=null && key.equals(property.getKey())) {
				props.add(property.getValue());
			}
		}
		return props;
	}
	
	public void overrideProperties(String key,Collection<String> values) {
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property property = iter.next();
			if (property!=null && key.equals(property.getKey())) {
				iter.remove();
			}
		}
		if (values==null) return;
		for (Object value : values) {
			properties.add(new Property(key,value.toString()));
		}
	}

	public void overrideFirstProperty(String key, String value) {
		boolean found = false;
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property element = iter.next();
			if (element!=null && element.getKey().equals(key)) {
				element.setValue(value);
				found=true;
				break;
			}
		}
		if (!found) {
			properties.add(new Property(key,value));
		}
	}

	public void overrideFirstProperty(String key, Double value) {
		boolean found = false;
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property element = iter.next();
			if (element!=null && element.getKey().equals(key)) {
				element.setDoubleValue(value);
				found=true;
				break;
			}
		}
		if (!found) {
			properties.add(new Property(key,value));
		}
	}

	public void overrideFirstProperty(String key, Date value) {
		boolean found = false;
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property element = iter.next();
			if (element!=null && element.getKey().equals(key)) {
				element.setDateValue(value);
				found=true;
				break;
			}
		}
		if (!found) {
			properties.add(new Property(key,value));
		}
	}

	public void removeProperties(String key) {
		for (Iterator<Property> iter = properties.iterator(); iter.hasNext();) {
			Property element = iter.next();
			if (element!=null && element.getKey().equals(key)) {
				iter.remove();
			}
		}
	}

	public void addProperty(String key, String value) {
		properties.add(new Property(key,value));
	}
}
