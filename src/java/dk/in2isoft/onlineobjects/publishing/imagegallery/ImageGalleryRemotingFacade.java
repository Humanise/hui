package dk.in2isoft.onlineobjects.publishing.imagegallery;

import java.util.Arrays;
import java.util.List;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;


public class ImageGalleryRemotingFacade extends AbstractRemotingFacade {

	//private static Logger log = Logger.getLogger(ImageGalleryRemotingFacade.class);

	public List<Image> listImages(long galleryId)
	throws EndUserException {
		ModelFacade model = getModel();
		ImageGallery gallery = model.loadEntity(ImageGallery.class, galleryId);
		List<Image> subs = model.getSubEntities(gallery, Image.class);
		return subs;
	}

	public void updateImageSize(long galleryId, int width, int height)
	throws EndUserException {
		ModelFacade model = getModel();
		ImageGallery gallery = model.loadEntity(ImageGallery.class, galleryId);
		gallery.setTiledWidth(width);
		gallery.setTiledHeight(height);
		model.updateItem(gallery, getUserSession());
	}
	
	public void updateImagePositions(long galleryId,long[] ids)
	throws ModelException, SecurityException {
		ModelFacade model = getModel();
		ImageGallery gallery = model.loadEntity(ImageGallery.class, galleryId);
		List<Relation> relations = getModel().getSubRelations(gallery);
		for (int i=0;i<ids.length;i++) {
			for (Relation relation : relations) {
				if (relation.getSubEntity().getId()==ids[i]) {
					relation.setPosition(i+1);
					getModel().updateItem(relation,getUserSession());
				}
			}
		}
	}
	
	public Image updateImage(long imageId,String title,String description,String[] tags) throws EndUserException {
		if (title==null || title.trim().length()==0) {
			throw new EndUserException("Cannot set title of image to null");
		}
		Image image = (Image) getModel().loadEntity(Image.class, imageId);
		if (image==null) {
			throw new EndUserException("Image with id="+imageId+" does not exist");
		}
		image.setName(title);
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, description);
		image.overrideProperties(Property.KEY_COMMON_TAG, Arrays.asList(tags));
		getModel().updateItem(image, getUserSession());
		return image;
	}
	
	public void deleteImage(long imageId,long imageGalleryId) throws EndUserException {
		ModelFacade model = getModel();
		Image image = (Image) model.loadEntity(Image.class, imageId);
		if (image==null) {
			throw new EndUserException("The image does not exist");
		}
		model.deleteEntity(image,getUserSession());
	}
	
	public void changeFrameStyle(long galleryId,String style) throws EndUserException {
		ModelFacade model = getModel();
		ImageGallery gallery = (ImageGallery) model.loadEntity(ImageGallery.class, galleryId);
		gallery.overrideFirstProperty(ImageGallery.PROPERTY_FRAMESTYLE,style);
		model.updateItem(gallery,getUserSession());
	}
}
