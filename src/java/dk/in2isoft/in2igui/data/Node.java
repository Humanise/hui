package dk.in2isoft.in2igui.data;

import java.util.List;

import com.google.common.collect.Lists;

public class Node {

	private String id;
	private String title;
	private List<Property> properties = Lists.newArrayList();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setId(Long id) {
		this.id = id==null ? null : id.toString(); 
	}

	public List<Property> getProperties() {
		return properties;
	}

	public void setProperties(List<Property> properties) {
		this.properties = properties;
	}
	
	public void addProperty(String label, String value) {
		properties.add(new Property(label,value));
	}
}
