package dk.in2isoft.onlineobjects.apps.photos;

import java.util.List;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ImageImporter extends dk.in2isoft.onlineobjects.apps.community.ImageImporter {

	public ImageImporter(ModelService modelService,ImageService imageService) {
		super(modelService, imageService);
	}

	@Override
	protected void postProcessImage(Image image, Map<String,String> parameters, Request request) throws EndUserException {

		long imageGalleryId = Long.parseLong(parameters.get("galleryId"));
		ImageGallery gallery = modelService.get(ImageGallery.class, imageGalleryId, request.getSession());
		
		Relation relation = new Relation(gallery, image);
		relation.setPosition(getMaxImagePosition(gallery) + 1);
		modelService.createItem(relation, request.getSession());

	}

	private float getMaxImagePosition(Entity gallery) throws EndUserException {
		float max = 0;
		List<Relation> relations = modelService.getChildRelations(gallery,Image.class);
		for (Relation relation : relations) {
			max = Math.max(max, relation.getPosition());
		}
		return max;
	}
}
