package dk.in2isoft.onlineobjects.apps.community;

import java.io.IOException;

import dk.in2isoft.in2igui.Interface;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public class PrivateSpaceController {

	private CommunityController controller;
	
	public PrivateSpaceController(CommunityController controller) {
		this.controller = controller;
	}
	
	protected void dispatch(Request request) throws EndUserException, IOException  {
		displayProfile(request);
	}
	
	private void displayProfile(Request request) throws EndUserException, IOException {
		Interface ui = new PrivateProfile(controller, request);
		ui.render(request.getRequest(),request.getResponse());
	}
}
