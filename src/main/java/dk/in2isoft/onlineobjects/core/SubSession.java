package dk.in2isoft.onlineobjects.core;

import dk.in2isoft.commons.lang.Strings;

public abstract class SubSession {

	private String userSessionId;
	private String id;
	
	public SubSession() {
		this.id = Strings.generateRandomString(20);
	}
	
	public final String getId() {
		return id;
	}
	
	public String getUserSessionId() {
		return userSessionId;
	}
	
	public void setUserSessionId(String userSessionId) {
		this.userSessionId = userSessionId;
	}
}
