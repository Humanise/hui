package dk.in2isoft.onlineobjects.service.image;

import java.io.File;
import java.io.IOException;

import dk.in2isoft.commons.http.FilePusher;
import dk.in2isoft.commons.util.ImageUtil;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.Request;

public class ImageController extends ServiceController {

	// private static Logger log = Logger.getLogger(ImageController.class);

	public ImageController() {
		super();
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		process(request);
	}

	private void process(Request request) throws IOException, EndUserException {
		long id = request.getLong("id");
		int thumbnail = request.getInt("thumbnail");
		int width = request.getInt("width");
		int height = request.getInt("height");
		boolean cropped = request.getBoolean("cropped");
		Image image = (Image) Core.getInstance().getModel().loadEntity(Image.class, id);
		if (image == null) {
			throw new EndUserException("Could not load image with id=" + id);
		}
		File file = image.getImageFile();
		String mime = image.getContentType();
		if (thumbnail > 0) {
			file = ImageUtil.getThumbnail(image, thumbnail);
			mime = "image/jpeg";
		} else if (width>0 && height>0) {
			if (cropped) {
				file = ImageUtil.getCroppedThumbnail(image, width, height);
			} else {
				file = ImageUtil.getThumbnail(image, width, height);
			}
			mime = "image/jpeg";
		}
		FilePusher pusher = new FilePusher(file);
		pusher.setClientSideCaching(true);
		pusher.push(request.getResponse(), mime);
	}

}
