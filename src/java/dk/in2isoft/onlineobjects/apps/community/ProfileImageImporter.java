package dk.in2isoft.onlineobjects.apps.community;

import java.util.List;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ProfileImageImporter extends ImageImporter {

	public ProfileImageImporter(ModelService modelService, ImageService imageService) {
		super(modelService, imageService);
	}

	@Override
	protected void postProcessImage(Image image, Map<String,String> parameters, Request request) throws EndUserException {

		Entity user = request.getSession().getUser();
		List<Relation> list = modelService.getChildRelations(user, Image.class, Relation.KIND_SYSTEM_USER_IMAGE);
		for (Relation relation : list) {
			modelService.deleteRelation(relation, request.getSession());
		}
		modelService.createRelation(user, image, Relation.KIND_SYSTEM_USER_IMAGE, request.getSession());

	}
}
