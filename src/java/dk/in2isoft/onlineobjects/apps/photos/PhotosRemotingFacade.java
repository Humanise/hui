package dk.in2isoft.onlineobjects.apps.photos;

import dk.in2isoft.onlineobjects.core.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.util.images.ImageService;
import dk.in2isoft.onlineobjects.util.images.ImageInfo.ImageLocation;

public class PhotosRemotingFacade extends AbstractRemotingFacade {

	private ImageService imageService;
	
	public void updateImageTitle(long id, String title) throws ModelException, SecurityException, ContentNotFoundException {
		Image image = getImage(id);
		image.setName(title);
		getModelService().updateItem(image, getUserSession());
	}

	private Image getImage(long id) throws ModelException, ContentNotFoundException {
		Image image = getModelService().get(Image.class, id,getUserSession());
		if (image==null) {
			throw new ContentNotFoundException("The image was not found");
		}
		return image;
	}

	public void updateImageDescription(long id, String description) throws ModelException, SecurityException, ContentNotFoundException {
		Image image = getImage(id);
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, description);
		getModelService().updateItem(image, getUserSession());
	}
	
	public void updateImageLocation(long id, ImageLocation location) throws ModelException, SecurityException, ContentNotFoundException {
		Image image = getImage(id);
		imageService.updateImageLocation(image, location, getUserSession());
	}
	
	public void relateWordToImage(long imageId, long wordId) throws ModelException, SecurityException, ContentNotFoundException {
		Image image = getImage(imageId);
		Word word = getModelService().get(Word.class, wordId, getUserSession());
		if (word==null) {
			throw new ContentNotFoundException("The word was not found");
		}
		Relation relation = modelService.getRelation(image, word);
		if (relation==null) {
			modelService.createRelation(image, word, getUserSession());
		}
	}
	
	public void removeWordRelation(long imageId, long wordId) throws ModelException, SecurityException, ContentNotFoundException {
		Image image = getImage(imageId);
		Word word = getModelService().get(Word.class, wordId, getUserSession());
		if (word==null) {
			throw new ContentNotFoundException("The word was not found");
		}
		Relation relation = modelService.getRelation(image, word);
		if (relation!=null) {
			modelService.deleteRelation(relation, getUserSession());
		}
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}
}
