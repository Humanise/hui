package dk.in2isoft.onlineobjects.core;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.model.User;

public class UserSession implements Priviledged {

	public static String SESSION_ATTRIBUTE = "OnlineObjects.UserSession";

	private Map<String, ApplicationSession> toolSessions;

	private User user;

	public UserSession() throws SecurityException {
		toolSessions = new HashMap<String, ApplicationSession>();
		user = Core.getInstance().getModel().getUser(SecurityController.PUBLIC_USERNAME);
		if (user == null) {
			throw new IllegalStateException("Could not get the public user!");
		}
	}
	
	protected void setUser(User user) {
		if (user==null) {
			throw new IllegalArgumentException("Cannot set the user to null");
		}
		this.user = user;
	}

	public User getUser() {
		return user;
	}
	
	public long getIdentity() {
		return user.getId();
	}

	public ApplicationSession getToolSession(String toolName) {
		if (this.toolSessions.containsKey(toolName)) {
			return toolSessions.get(toolName);
		} else {
			ApplicationController ctrl = Core.getInstance().getApplicationManager().getController(toolName);
			ApplicationSession session = ctrl.createToolSession();
			if (session != null) {
				toolSessions.put(toolName, session);
			}
			return session;
		}
	}
	
	public static UserSession getUserSession(HttpServletRequest request) {
		return (UserSession) request.getSession().getAttribute(SESSION_ATTRIBUTE);
	}
}