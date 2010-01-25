package dk.in2isoft.onlineobjects.apps.videosharing;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Request;

public class VideosharingController extends ApplicationController {

	private ImportService importService;
	private VideoService videoService;
	
	public VideosharingController() {
		super("videosharing");
		addJsfMatcher("users/<username>", "profile/index.xhtml");
		addJsfMatcher("users/<username>/<integer>", "profile/video/index.xhtml");
		addJsfMatcher("", "index.xhtml");
	}
	
	@Override
	public ApplicationSession createToolSession() {
		return new VideosharingSession();
	}

	@RequestMapping(start={"importVideo.action"})
	public void importVideo(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		VideoImporter listener = new VideoImporter(modelService, videoService);
		dataImporter.setListener(listener);
		dataImporter.importMultipart(this, request);
		
	}
	
	// Injection...

	public void setImportService(ImportService importService) {
		this.importService = importService;
	}

	public ImportService getImportService() {
		return importService;
	}

	public void setVideoService(VideoService videoService) {
		this.videoService = videoService;
	}

	public VideoService getVideoService() {
		return videoService;
	}
}
