package dk.in2isoft.onlineobjects.apps.community.remoting;

import java.util.Collection;

public class InternetAddressInfo {

	private Long id;
	private String name;
	private String address;
	private String description;
	private Collection<String> tags;
	
	public InternetAddressInfo() {
		
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public void setTags(Collection<String> tags) {
		this.tags = tags;
	}

	public Collection<String> getTags() {
		return tags;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getAddress() {
		return address;
	}

}
