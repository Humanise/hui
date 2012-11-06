package dk.in2isoft.onlineobjects.apps.photos;

import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.ui.Request;


public class PhotosController extends PhotosControllerBase {

	@Path(start="updateTitle")
	public void updateImageTitle(Request request) throws ModelException, SecurityException, ContentNotFoundException {
		UserSession session = request.getSession();
		long id = request.getInt("id");
		String title = request.getString("title");
		Image image = getImage(id,session);
		image.setName(title);
		modelService.updateItem(image, session);
	}

	private Image getImage(long id, Privileged privileged) throws ModelException, ContentNotFoundException {
		Image image = getModelService().get(Image.class, id,privileged);
		if (image==null) {
			throw new ContentNotFoundException("The image was not found");
		}
		return image;
	}
}
