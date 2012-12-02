package dk.in2isoft.onlineobjects.apps.setup;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public class SetupController extends ApplicationController {

	public SetupController() {
		super("setup");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		if (!request.isUser(SecurityService.ADMIN_USERNAME)) {
			request.redirectFromBase("/service/authentication/?redirect=/app/setup/&action=appAccessDenied&faultyuser="+request.getSession().getUser().getUsername());
		} else {
			showGui(request);
		}
	}
}
