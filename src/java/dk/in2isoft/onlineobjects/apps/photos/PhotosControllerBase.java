package dk.in2isoft.onlineobjects.apps.photos;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.ui.Request;

public class PhotosControllerBase extends ApplicationController {

	public PhotosControllerBase() {
		super("photos");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/photo/<integer>.html", "photo.xhtml");
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