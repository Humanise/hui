package dk.in2isoft.onlineobjects.apps.videosharing;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.importing.ImportListener;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.ui.Request;

class VideoImporter implements ImportListener<Object> {

	protected ModelService modelService;
	private VideoService videoService;

	public VideoImporter(ModelService modelService, VideoService videoService) {
		super();
		this.modelService = modelService;
		this.videoService = videoService;
	}
		
	public void processFile(File file, String mimeType, String name, Map<String, String> parameters, Request request) throws IOException, EndUserException {
		Video video = new Video();
		video.setName(name);
		modelService.createItem(video, request.getSession());
		videoService.changeImageFile(video, file, mimeType);
		modelService.updateItem(video, request.getSession());
	}

	@Override
	public Object getResponse() {
		return null;
	}
	
	public String getProcessName() {
		return "videoImport";
	}
}