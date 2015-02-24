package dk.in2isoft.onlineobjects.model;

public class RemoteAccount extends Entity {

	public static String TYPE = Entity.TYPE+"/RemoteAccount";
	public static String NAMESPACE = Entity.NAMESPACE+"RemoteAccount/";

	private String username;
	private String domain;
	
	public RemoteAccount() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUsername() {
		return username;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getDomain() {
		return domain;
	}
}
