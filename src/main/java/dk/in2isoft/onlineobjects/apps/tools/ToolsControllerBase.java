package dk.in2isoft.onlineobjects.apps.tools;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public abstract class ToolsControllerBase extends ApplicationController {

	protected ImportService importService;
	protected ImageService imageService;
	
	public ToolsControllerBase() {
		super("tools");
	}

	@Override
	public String getLanguage(Request request) {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			return path[0];
		}
		return super.getLanguage(request);
	}

	public void setImportService(ImportService importService) {
		this.importService = importService;
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}
}