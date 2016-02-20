package dk.in2isoft.onlineobjects.apps.videosharing;

import java.util.List;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.images.ImageImporter;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

class VideoPosterImporter extends ImageImporter {

	private SecurityService securityService;
	
	public VideoPosterImporter(ModelService modelService, ImageService imageService, SecurityService securityService) {
		super(modelService, imageService);
		this.securityService = securityService;
	}
	
	@Override
	protected boolean isRequestLegal(Map<String, String> parameters, Request request) throws EndUserException {
		long videoId = Long.parseLong(parameters.get("videoId"));
		Video video = modelService.get(Video.class, videoId, request.getSession());
		if (video==null) {
			return false;
		}
		return modelService.canUpdate(video,request.getSession());
	}
	
	@Override
	protected void postProcessImage(Image image, Map<String, String> parameters, Request request) throws EndUserException {
		long videoId = Long.parseLong(parameters.get("videoId"));
		Video video = modelService.get(Video.class, videoId, request.getSession());
		if (video==null) {
			throw new IllegalRequestException("Unable to find video");
		}
		if (!modelService.canUpdate(video,request.getSession())) {
			throw new SecurityException("You cannot do this!");
		}
		List<Relation> list = modelService.getRelationsFrom(video, Image.class);
		for (Relation relation : list) {
			modelService.deleteRelation(relation, request.getSession());
		}
		securityService.grantPublicPrivileges(image, true, false, false);
		modelService.createRelation(video, image, request.getSession());
	}
	
}