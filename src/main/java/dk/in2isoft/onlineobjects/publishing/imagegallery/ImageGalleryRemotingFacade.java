package dk.in2isoft.onlineobjects.publishing.imagegallery;

import java.util.Arrays;
import java.util.List;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class ImageGalleryRemotingFacade extends AbstractRemotingFacade {

	// private static Logger log =
	// Logger.getLogger(ImageGalleryRemotingFacade.class);

	public List<Image> listImages(long galleryId) throws EndUserException {
		ImageGallery gallery = modelService.get(ImageGallery.class, galleryId,
				getUserSession());
		List<Image> subs = modelService
				.getChildrenOrdered(gallery, Image.class);
		return subs;
	}

	public void updateImageSize(long galleryId, int width, int height)
			throws EndUserException {
		ImageGallery gallery = modelService.get(ImageGallery.class, galleryId, getUserSession());
		gallery.setTiledWidth(width);
		gallery.setTiledHeight(height);
		modelService.updateItem(gallery, getUserSession());
	}

	public void updateImagePositions(long galleryId, long[] ids)
			throws ModelException, SecurityException {
		ImageGallery gallery = modelService.get(ImageGallery.class, galleryId, getUserSession());
		List<Relation> relations = modelService.getRelationsFrom(gallery);
		for (int i = 0; i < ids.length; i++) {
			for (Relation relation : relations) {
				if (relation.getTo().getId() == ids[i]) {
					relation.setPosition(i + 1);
					modelService.updateItem(relation, getUserSession());
				}
			}
		}
	}

	public Image updateImage(long imageId, String title, String description,
			String[] tags) throws EndUserException {
		if (title == null || title.trim().length() == 0) {
			throw new EndUserException("Cannot set title of image to null");
		}
		Image image = modelService.get(Image.class, imageId, getUserSession());
		if (image == null) {
			throw new EndUserException("Image with id=" + imageId
					+ " does not exist");
		}
		image.setName(title);
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, description);
		image.overrideProperties(Property.KEY_COMMON_TAG, Arrays.asList(tags));
		modelService.updateItem(image, getUserSession());
		return image;
	}

	public void deleteImage(long imageId, long imageGalleryId)
			throws EndUserException {
		Image image = modelService.get(Image.class, imageId, getUserSession());
		if (image == null) {
			throw new EndUserException("The image does not exist");
		}
		modelService.deleteEntity(image, getUserSession());
	}

	public void changeFrameStyle(long galleryId, String style)
			throws EndUserException {
		ImageGallery gallery = modelService.get(ImageGallery.class, galleryId,
				getUserSession());
		gallery.overrideFirstProperty(ImageGallery.PROPERTY_FRAMESTYLE, style);
		modelService.updateItem(gallery, getUserSession());
	}
}
