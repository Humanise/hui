package dk.in2isoft.onlineobjects.apps.account;

import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.ui.Request;


public class AccountController extends AccountControllerBase {

	@Override
	public boolean isAllowed(Request request) {
		return !request.isUser(SecurityService.PUBLIC_USERNAME);
	}
}
