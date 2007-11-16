package dk.in2isoft.onlineobjects.apps.renderer;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class RendererController extends ApplicationController {

	public RendererController() {
		super("renderer");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		Interface gui = new Base();
		gui.display(request);
	}

}
