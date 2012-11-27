package dk.in2isoft.onlineobjects.apps.photos;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class PhotosControllerBase extends ApplicationController {

	protected ImageService imageService;
	protected SecurityService securityService;

	public PhotosControllerBase() {
		super("photos");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/photo/<integer>.html", "photo.xhtml");
		addJsfMatcher("/<language>/users/<username>", "user.xhtml");
	}

	@Override
	public String getLanguage(Request request) {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			return path[0];
		}
		return super.getLanguage(request);
	}

	protected Image getImage(long id, Privileged privileged) throws ModelException, ContentNotFoundException {
		Image image = modelService.get(Image.class, id,privileged);
		if (image==null) {
			throw new ContentNotFoundException("The image was not found");
		}
		return image;
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}