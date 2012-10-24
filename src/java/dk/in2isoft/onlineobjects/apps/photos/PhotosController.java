package dk.in2isoft.onlineobjects.apps.photos;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public class PhotosController extends ApplicationController {

	public PhotosController() {
		super("photos");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/photo/<integer>.html", "photo.xhtml");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		super.unknownRequest(request);
	}
	
	@Override
	public String getLanguage(Request request) {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			return path[0];
		}
		return super.getLanguage(request);
	}
}
