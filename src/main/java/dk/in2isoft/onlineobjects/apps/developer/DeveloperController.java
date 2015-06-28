package dk.in2isoft.onlineobjects.apps.developer;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class DeveloperController extends ApplicationController {

	private ImportService importService;
	private VideoService videoService;
	private ImageService imageService;
	
	public DeveloperController() {
		super("developer");
		addJsfMatcher("/components.html", "components.xhtml");
		addJsfMatcher("/", "index.xhtml");
	}
	
	public List<Locale> getLocales() {
		return null;
	}
	
	@Override
	public boolean isAllowed(Request request) {
		return configurationService.isDevelopmentMode();
	}

	@Path(start={"test"})
	public void importVideo(Request request) throws IOException, EndUserException {
		throw new ContentNotFoundException();
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

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public ImageService getImageService() {
		return imageService;
	}
}
