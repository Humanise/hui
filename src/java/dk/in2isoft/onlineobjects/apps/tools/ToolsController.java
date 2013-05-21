package dk.in2isoft.onlineobjects.apps.tools;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.images.ImageImporter;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.ui.Request;


public class ToolsController extends ToolsControllerBase {

	public List<Locale> getLocales() {
		return null;
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		String[] localPath = request.getLocalPath();
		if (localPath.length==0) {
			request.getResponse().sendRedirect("images/");
		} else if (request.testLocalPathFull("images")) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","images.gui.xml"));
			ui.setParameter("username", request.getSession().getUser().getUsername());
			ui.render(request.getRequest(), request.getResponse());
		} else if (request.testLocalPathFull("persons")) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","persons.gui.xml"));
			ui.setParameter("username", request.getSession().getUser().getUsername());
			ui.render(request.getRequest(), request.getResponse());
		} else if (request.testLocalPathFull("bookmarks")) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","bookmarks.gui.xml"));
			ui.setParameter("username", request.getSession().getUser().getUsername());
			ui.render(request.getRequest(), request.getResponse());
		} else if (request.testLocalPathFull("integration")) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","integration.gui.xml"));
			ui.setParameter("username", request.getSession().getUser().getUsername());
			ui.render(request.getRequest(), request.getResponse());
		} else {
			super.unknownRequest(request);
		}
	}

	@Path(start="uploadImage")
	public void importImage(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		dataImporter.setListener(new ImageImporter(modelService,imageService));
		dataImporter.importMultipart(this, request);
	}
	
	@Override
	public boolean isAllowed(Request request) {
		return request.isLoggedIn();
	}
}
