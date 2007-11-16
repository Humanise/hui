package dk.in2isoft.onlineobjects.apps.security;

import java.io.IOException;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class SecurityController extends ApplicationController {

	private static Logger log = Logger.getLogger(SecurityController.class);
	
	public SecurityController() {
		super("security");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		log.info("User: "+request.getSession().getUser().getUsername());
		Interface gui = new Base();
		gui.display(request);
	}

	public void newUser(Request request)
	throws IOException,EndUserException {
		Interface gui = new NewUser();
		gui.display(request);
	}
	
}
