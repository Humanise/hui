package dk.in2isoft.onlineobjects.service.authentication.views;

import dk.in2isoft.commons.jsf.AbstractView;

public class AuthenticationLoginView extends AbstractView {
	
	
	public String getCurrentUserName() {
		return getUserName();
	}
	
	public String getRedirect() {
		return getRequest().getString("redirect");
	}
	
	public String getMessage() {
		String action = getRequest().getString("action");
		if ("appAccessDenied".equals(action)) {
			return "The current user does not have access to this application";
		}
		return null;
	}
}
