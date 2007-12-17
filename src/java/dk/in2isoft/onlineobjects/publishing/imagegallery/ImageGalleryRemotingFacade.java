package dk.in2isoft.onlineobjects.publishing.imagegallery;

import java.util.List;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;


public class ImageGalleryRemotingFacade extends AbstractRemotingFacade {

	//private static Logger log = Logger.getLogger(ImageGalleryRemotingFacade.class);

	public List<Entity> listImages(long galleryId)
	throws EndUserException {
		ModelFacade model = getModel();
		ImageGallery gallery = (ImageGallery) model.loadEntity(ImageGallery.class, galleryId);
		List<Entity> subs = model.getSubEntities(gallery, Image.class);
		return subs;
	}
	
	public void updateImagePsitions(long galleryId,long[] ids)
	throws ModelException {
		ModelFacade model = getModel();
		ImageGallery gallery = (ImageGallery) model.loadEntity(ImageGallery.class, galleryId);
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
	
	public void deleteImage(long imageId,long imageGalleryId) throws EndUserException {
		ModelFacade model = getModel();
		Image image = (Image) model.loadEntity(Image.class, imageId);
		if (image==null) {
			throw new EndUserException("The image does not exist");
		}
		model.deleteEntity(image);
	}
	
	public void changeFrameStyle(long galleryId,String style) throws EndUserException {
		ModelFacade model = getModel();
		ImageGallery gallery = (ImageGallery) model.loadEntity(ImageGallery.class, galleryId);
		gallery.overrideFirstProperty(ImageGallery.PROPERTY_FRAMESTYLE,style);
		model.updateItem(gallery,getUserSession());
	}
}
