package dk.in2isoft.onlineobjects.apps.community;

import java.util.List;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.modules.images.ImageImporter;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ImageGalleryImporter extends ImageImporter {

	public ImageGalleryImporter(ModelService modelService,ImageService imageService) {
		super(modelService, imageService);
	}

	@Override
	protected void postProcessImage(Image image, Map<String,String> parameters, Request request) throws EndUserException {

		long imageGalleryId = Long.parseLong(parameters.get("contentId"));
		ImageGallery gallery = modelService.get(ImageGallery.class, imageGalleryId, request.getSession());
		
		Relation relation = new Relation(gallery, image);
		relation.setPosition(getMaxImagePosition(gallery) + 1);
		modelService.createItem(relation, request.getSession());

	}

	private float getMaxImagePosition(Entity gallery) throws EndUserException {
		// TODO : Consider only images (URGENT)
		List<Relation> relations = modelService.getRelationsFrom(gallery);
		if (relations.size() > 0) {
			return relations.get(relations.size() - 1).getPosition();
		} else {
			return 0;
		}
	}
}
