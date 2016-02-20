package dk.in2isoft.onlineobjects.apps.photos;

import java.util.ArrayList;
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
import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ImageGalleryImporter extends ImageImporter {
	
	private List<SimpleEntityPerspective> imported; 

	public ImageGalleryImporter(ModelService modelService,ImageService imageService) {
		super(modelService, imageService);
		imported = new ArrayList<SimpleEntityPerspective>();
	}

	@Override
	protected void postProcessImage(Image image, Map<String,String> parameters, Request request) throws EndUserException {

		int index = Integer.parseInt(parameters.get("index"));
		long imageGalleryId = Long.parseLong(parameters.get("galleryId"));
		ImageGallery gallery = modelService.get(ImageGallery.class, imageGalleryId, request.getSession());
		
		Relation relation = new Relation(gallery, image);
		relation.setPosition(getMaxImagePosition(gallery) + 1 + index);
		modelService.createItem(relation, request.getSession());

		imported.add(SimpleEntityPerspective.create(image));
	}

	private float getMaxImagePosition(Entity gallery) throws EndUserException {
		float max = 0;
		List<Relation> relations = modelService.getRelationsFrom(gallery,Image.class);
		for (Relation relation : relations) {
			max = Math.max(max, relation.getPosition());
		}
		return max;
	}
	
	@Override
	public Object getResponse() {
		return imported;
	}
}
