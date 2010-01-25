package dk.in2isoft.onlineobjects.core;

import java.util.HashMap;
import java.util.Map;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.model.User;

public class UserSession implements Priviledged {

	public static String SESSION_ATTRIBUTE = "OnlineObjects.UserSession";

	private Map<Class<? extends ApplicationController>, ApplicationSession> toolSessions;

	private User user;

	public UserSession() throws SecurityException {
		toolSessions = new HashMap<Class<? extends ApplicationController>, ApplicationSession>();
		user = Core.getInstance().getModel().getUser(SecurityService.PUBLIC_USERNAME);
		if (user == null) {
			throw new IllegalStateException("Could not get the public user!");
		}
	}
	
	protected void setUser(User user) {
		if (user==null) {
			throw new IllegalArgumentException("Cannot set the user to null");
		}
		if (user.isNew()) {
			throw new IllegalArgumentException("Cannot set a user that is not persistent");
		}
		this.user = user;
	}

	public User getUser() {
		return user;
	}
	
	public long getIdentity() {
		return user.getId();
	}

	public ApplicationSession getApplicationSession(ApplicationController controller) {
		if (this.toolSessions.containsKey(controller.getClass())) {
			return toolSessions.get(controller.getClass());
		} else {
			ApplicationSession session = controller.createToolSession();
			if (session != null) {
				toolSessions.put(controller.getClass(), session);
			}
			return session;
		}
	}

	public boolean isSuper() {
		return (user==null ? false : user.isSuper());
	}

	@Override
	public String toString() {
		return "User session for user:"+user;
	}
	
	
}