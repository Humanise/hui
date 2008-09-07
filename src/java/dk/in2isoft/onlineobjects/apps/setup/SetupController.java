package dk.in2isoft.onlineobjects.apps.setup;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.SecurityController;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class SetupController extends ApplicationController {

	public SetupController() {
		super("setup");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		if (!request.isUser(SecurityController.ADMIN_USERNAME)) {
			request.redirectFromBase("/service/authentication/?redirect=/app/setup/&action=appAccessDenied");
		} else if (!showGui(request)) {
			Interface gui = new Base();
			gui.display(request);
		}
	}
}
