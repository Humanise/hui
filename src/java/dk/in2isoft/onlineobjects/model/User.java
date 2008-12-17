package dk.in2isoft.onlineobjects.model;

import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.core.SecurityController;

public class User extends Entity implements Priviledged {

	public static String TYPE = Entity.TYPE+"/User";
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
		return "common/user";
	}

	@Override
	public String getNamespace() {
		return NAMESPACE;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		if (name==null || name.equals(this.username)) {
			this.name = username;			
		}
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public long getIdentity() {
		return getId();
	}

	public boolean isSuper() {
		return SecurityController.ADMIN_USERNAME.equals(username);
	}
}
