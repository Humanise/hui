package dk.in2isoft.onlineobjects.service.authentication;

import java.io.IOException;

import org.apache.log4j.Logger;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.Request;

public class AuthenticationController extends ServiceController {

	private static Logger log = Logger.getLogger(AuthenticationController.class);

	public AuthenticationController() {
		super("authentication");
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		new LoginPage(this,request).display(request);
	}

	public void authenticate(Request request) throws IOException, EndUserException {
		String username = request.getString("username");
		String password = request.getString("password");
		String redirect = request.getString("redirect");
		boolean success = Core.getInstance().getSecurityService().changeUser(request.getSession(), username, password);
		log.debug(success);
		if (success) {
			if (LangUtil.isDefined(redirect)) {
				request.redirectFromBase(redirect);
			} else {
				request.redirect(".?action=loggedIn");
			}
		} else {
			request.redirect(".?action=invalidLogin&redirect="+redirect);
		}
	}
	

	public void logout(Request request) throws IOException, EndUserException {
		Core.getInstance().getSecurityService().logOut(request.getSession());
		request.redirect(".?action=loggedOut");
	}
}
