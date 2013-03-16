package dk.in2isoft.onlineobjects.service.authentication.views;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.util.Messages;

public class AuthenticationLoginView extends AbstractView {
	
	private static final Messages messages = new Messages(AuthenticationLoginView.class);
	
	public String getCurrentUserName() {
		return getUserName();
	}
	
	public String getRedirect() {
		return getRequest().getString("redirect");
	}
	
	public String getMessage() {
		String action = getRequest().getString("action");
		if (Strings.isBlank(action)) {
			return null;
		}
		return messages.get("action_"+action, getLocale());
	}
}
