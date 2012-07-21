package dk.in2isoft.onlineobjects.apps.setup;

public class ApplicationInfo {
	
	private String name;
	private String domain;
	private Long id;

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getDomain() {
		return domain;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}
}