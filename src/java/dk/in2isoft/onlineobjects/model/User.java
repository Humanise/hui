package dk.in2isoft.onlineobjects.model;

public class User extends Entity {

	private static String ICON = "Element/User";
	public static String TYPE = "Entity/User";
	public static String NAMESPACE = Entity.NAMESPACE+"User/";
	
	private String username;
	private String password;

	public User() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return ICON;
	}

	@Override
	public String getNamespace() {
		return NAMESPACE;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
		this.name = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
