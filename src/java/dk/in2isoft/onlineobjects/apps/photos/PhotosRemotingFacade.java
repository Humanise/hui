package dk.in2isoft.onlineobjects.apps.photos;

import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.util.images.ImageService;
import dk.in2isoft.onlineobjects.util.images.ImageInfo.ImageLocation;

public class PhotosRemotingFacade extends AbstractRemotingFacade {

	private ImageService imageService;
	
	public void updateImageTitle(long id, String title) throws ModelException, SecurityException {
		Image image = getModelService().get(Image.class, id,getUserSession());
		image.setName(title);
		getModelService().updateItem(image, getUserSession());
	}

	public void updateImageDescription(long id, String description) throws ModelException, SecurityException {
		Image image = getModelService().get(Image.class, id,getUserSession());
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, description);
		getModelService().updateItem(image, getUserSession());
	}
	
	public void updateImageLocation(long id, ImageLocation location) throws ModelException, SecurityException {
		Image image = getModelService().get(Image.class, id, getUserSession());
		imageService.updateImageLocation(image, location, getUserSession());
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}
}
