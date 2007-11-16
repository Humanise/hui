package dk.in2isoft.onlineobjects.core;

import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.User;

public class SecurityController {
	
	public static String PUBLIC_USERNAME = "public";
	
	protected SecurityController() {
		
	}

	/**
	 * Tries to change the user of a session
	 * @param userSession The session to change user on
	 * @param username The username
	 * @param password The password
	 * @return True if user was changed
	 */
	public boolean changeUser(UserSession userSession, String username, String password) {
		if (userSession==null || username==null || password==null) {
			throw new IllegalArgumentException("session, username or password is null");
		}
		User user = Core.getInstance().getModel().getUser(username);
		if (user==null) {
			return false;
		} else if (password.equals(user.getPassword())) {
			userSession.setUser(user);
			return true;
		} else {
			return false;			
		}
	}
	
	public boolean logOut(UserSession userSession) {
		User user = Core.getInstance().getModel().getUser("public");
		if (user==null) {
			return false;
		} else {
			userSession.setUser(user);
			return true;
		}
	}
	
	public boolean canModify(Item item,Priviledged priviledged) {
		Privilege privilege = Core.getInstance().getModel().getPriviledge(item.getId(), priviledged.getIdentity());
		if (privilege==null) {
			return false;
		} else {
			return privilege.isAlter();
		}
	}
}
