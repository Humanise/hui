package dk.in2isoft.onlineobjects.core;

import dk.in2isoft.commons.lang.LangUtil;

public abstract class SubSession {

	private String userSessionId;
	private String id;
	
	public SubSession() {
		this.id = LangUtil.generateRandomString(20);
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
