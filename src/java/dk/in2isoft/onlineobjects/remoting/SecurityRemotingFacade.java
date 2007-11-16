package dk.in2isoft.onlineobjects.remoting;

import javax.servlet.http.HttpServletRequest;

import org.directwebremoting.WebContextFactory;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.User;

public class SecurityRemotingFacade {

	public boolean changeUser(String username, String password) throws EndUserException {
		if (username == null || username.length() == 0) {
			throw new IllegalArgumentException("Username must have a length!");
		}
		if (password == null || password.length() == 0) {
			throw new IllegalArgumentException("Password must have a length!");
		}
		HttpServletRequest request = WebContextFactory.get().getHttpServletRequest();
		UserSession session = UserSession.getUserSession(request);
		return Core.getInstance().getSecurity().changeUser(session, username, password);
	}

	public boolean logOut() throws EndUserException {
		HttpServletRequest request = WebContextFactory.get().getHttpServletRequest();
		UserSession session = UserSession.getUserSession(request);
		return Core.getInstance().getSecurity().logOut(session);
	}

	public User getUser() {
		HttpServletRequest request = WebContextFactory.get().getHttpServletRequest();
		UserSession session = UserSession.getUserSession(request);
		return session.getUser();
	}
}
