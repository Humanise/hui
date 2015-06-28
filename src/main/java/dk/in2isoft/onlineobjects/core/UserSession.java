package dk.in2isoft.onlineobjects.core;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.model.User;

public class UserSession implements Privileged {

	public static String SESSION_ATTRIBUTE = "OnlineObjects.UserSession";

	private Map<Class<? extends ApplicationController>, ApplicationSession> toolSessions;

	private User user;
	
	private String id;

	public UserSession(User user) {
		this.id = Strings.generateRandomString(50);
		toolSessions = new HashMap<Class<? extends ApplicationController>, ApplicationSession>();
		this.user = user;
	}
	
	public String getId() {
		return id;
	}
	
	public static UserSession get(HttpSession session) {
		Object object = session.getAttribute(SESSION_ATTRIBUTE);
		if (object instanceof UserSession) {
			return (UserSession) object;
		}
		return null;
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