package dk.in2isoft.onlineobjects.apps.desktop;

import java.io.IOException;

import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public class DesktopController extends ApplicationController {

	public DesktopController() {
		super("desktop");
	}
	
	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		String[] localPath = request.getLocalPath();
		if (localPath.length==0) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","index.gui.xml"));
			ui.render(request.getRequest(), request.getResponse());
		} else {
			super.unknownRequest(request);
		}
	}
}
