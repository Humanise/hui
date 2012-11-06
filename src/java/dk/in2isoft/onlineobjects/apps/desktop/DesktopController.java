package dk.in2isoft.onlineobjects.apps.desktop;

import java.io.IOException;

import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.importing.DataImporter;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Request;

public class DesktopController extends ApplicationController {
	
	private ImportService importService;

	public DesktopController() {
		super("desktop");
	}
	
	@Override
	public ApplicationSession createToolSession() {
		return new DesktopSession();
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
	
	@Path(start="upload")
	public void uploadFile(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		FileImporter listener = new FileImporter();
		dataImporter.setListener(listener);
		dataImporter.importMultipart(this, request);
	}
	
	public void setImportService(ImportService importService) {
		this.importService = importService;
	}
}
