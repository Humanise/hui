package dk.in2isoft.onlineobjects.apps.videosharing;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.apps.community.ProfileImageImporter;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.images.ImageImporter;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class VideosharingController extends ApplicationController {

	private ImportService importService;
	private VideoService videoService;
	private ImageService imageService;
	private SecurityService securityService;
	
	public VideosharingController() {
		super("videosharing");
		addJsfMatcher("/users/<username>", "profile/index.xhtml");
		addJsfMatcher("/users", "users.xhtml");
		addJsfMatcher("/charts", "charts.xhtml");
		addJsfMatcher("/explore", "explore.xhtml");
		addJsfMatcher("/mobile", "mobile.xhtml");
		addJsfMatcher("/downloads", "downloads.xhtml");
		addJsfMatcher("/contest", "contest.xhtml");
		addJsfMatcher("/contestinfo", "contestinfo.xhtml");
		addJsfMatcher("/labels", "labels.xhtml");
		addJsfMatcher("/rating", "rating.xhtml");
		addJsfMatcher("/star", "star.xhtml");
		addJsfMatcher("/news", "news.xhtml");
		addJsfMatcher("/prize", "prize.xhtml");
		addJsfMatcher("/areyouastar", "areyouastar.xhtml");
		addJsfMatcher("/users/<username>/<integer>", "profile/video/index.xhtml");
		addJsfMatcher("/", "index.xhtml");
	}
	
	@Override
	public List<Locale> getLocales() {
		return null;
	}
	
	@Override
	public ApplicationSession createToolSession() {
		return new VideosharingSession();
	}

	@Path(start={"importVideo.action"})
	public void importVideo(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		VideoImporter listener = new VideoImporter(modelService, videoService);
		dataImporter.setListener(listener);
		dataImporter.importMultipart(this, request);
	}

	@Path(start={"changeVideoPoster.action"})
	public void changeVideoPoster(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		VideoPosterImporter listener = new VideoPosterImporter(modelService, imageService, securityService);
		dataImporter.setListener(listener);
		dataImporter.importMultipart(this, request);
	}

	@Path(start={"changeProfileImage.action"})
	public void changeProfileImage(Request request) throws EndUserException, IOException {
		DataImporter dataImporter = importService.createImporter();
		ImageImporter listener = new ProfileImageImporter(modelService,imageService, securityService);
		dataImporter.setListener(listener);
		dataImporter.importMultipart(this, request);
	}
	
	// Injection...

	public void setImportService(ImportService importService) {
		this.importService = importService;
	}

	public void setVideoService(VideoService videoService) {
		this.videoService = videoService;
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
