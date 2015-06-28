package dk.in2isoft.onlineobjects.service.video;

import java.io.File;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import dk.in2isoft.commons.http.FilePusher;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class VideoController extends ServiceController {

	private ImageService imageService;
	private ModelService modelService;
	private FileService fileService;
	private VideoService videoService;
	
	private Pattern idPattern;

	public VideoController() {
		super("video");
		idPattern = Pattern.compile("id([0-9]+)");
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			String subject = path[0];
			long id = Long.valueOf(match(idPattern,subject));
			process(request,id);
		} else {
			throw new IllegalRequestException();
		}
	}

	private String match(Pattern pattern, String subject) {
		Matcher matcher = pattern.matcher(subject);
		if (matcher.find()) {
			for (int i = 0; i <= matcher.groupCount(); i++) {
				if (i==1) {
					return matcher.group(i);
				}
			}
		}
		return null;
	}

	private void process(Request request, long id) throws IOException, EndUserException {
		Video video = modelService.get(Video.class, id, request.getSession());
		File file = videoService.getVideoFile(video);
		FilePusher pusher = new FilePusher(file);
		pusher.setClientSideCaching(true);
		pusher.setDownload(request.getBoolean("download"));
		pusher.push(request.getResponse(), video.getContentType());
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public ImageService getImageService() {
		return imageService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}

	public void setVideoService(VideoService videoService) {
		this.videoService = videoService;
	}

	public VideoService getVideoService() {
		return videoService;
	}

}
