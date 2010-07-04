package dk.in2isoft.onlineobjects.apps.videosharing;

import java.util.List;
import java.util.Map;

import dk.in2isoft.onlineobjects.apps.community.ImageImporter;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Video;
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
		Video video = modelService.get(Video.class, videoId);
		if (video==null) {
			return false;
		}
		return modelService.canUpdate(video,request.getSession());
	}
	
	@Override
	protected void postProcessImage(Image image, Map<String, String> parameters, Request request) throws EndUserException {
		long videoId = Long.parseLong(parameters.get("videoId"));
		Video video = modelService.get(Video.class, videoId);
		if (video==null) {
			throw new IllegalRequestException("Unable to find video");
		}
		if (!modelService.canUpdate(video,request.getSession())) {
			throw new SecurityException("You cannot do this!");
		}
		List<Relation> list = modelService.getChildRelations(video, Image.class);
		for (Relation relation : list) {
			modelService.deleteRelation(relation, request.getSession());
		}
		securityService.grantPublicPrivileges(image, true, false, false);
		modelService.createRelation(video, image, request.getSession());
	}
	
}