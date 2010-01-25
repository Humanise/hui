package dk.in2isoft.onlineobjects.service.image;

import java.io.File;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import dk.in2isoft.commons.http.FilePusher;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ImageController extends ServiceController {

	private ImageService imageService;
	private ModelService modelService;
	
	private Pattern idPattern;
	private Pattern widthPattern;
	private Pattern heightPattern;
	private Pattern thumbnailPattern;
	private Pattern sepiaPattern;

	public ImageController() {
		super("image");
		idPattern = Pattern.compile("id([0-9]+)");
		widthPattern = Pattern.compile("width([0-9]+)");
		heightPattern = Pattern.compile("height([0-9]+)");
		thumbnailPattern = Pattern.compile("thumbnail([0-9]+)");
		sepiaPattern = Pattern.compile("sepia([0-9]+)");
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			String subject = path[path.length-1];
			long id = Long.valueOf(match(idPattern,subject));
			int width = parseInt(match(widthPattern,subject));
			int height = parseInt(match(heightPattern,subject));
			int thumbnail = parseInt(match(thumbnailPattern,subject));
			int sepia = parseInt(match(sepiaPattern,subject));
			boolean cropped = subject.indexOf("cropped")!=-1;
			process(request,id,thumbnail,width,height,cropped);
		} else {
			long id = request.getLong("id");
			int thumbnail = request.getInt("thumbnail");
			int width = request.getInt("width");
			int height = request.getInt("height");
			boolean cropped = request.getBoolean("cropped");
			process(request,id,thumbnail,width,height,cropped);
		}
	}
	
	private int parseInt(String str) {
		if (str==null) {
			return 0;
		} else {
			return Integer.valueOf(str);
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

	private void process(Request request, long id, int thumbnail, int width, int height, boolean cropped) throws IOException, EndUserException {		
		File file;
		String mime;
		if (thumbnail > 0) {
			if (cropped) {
				file = imageService.getCroppedThumbnail(id, thumbnail, thumbnail);
			} else {
				file = imageService.getThumbnail(id, thumbnail);
			}
			mime = "image/jpeg";
		} else if (width > 0 && height > 0) {
			if (cropped) {
				file = imageService.getCroppedThumbnail(id, width, height);
			} else {
				file = imageService.getThumbnail(id, width, height);
			}
			mime = "image/jpeg";
		} else {
			Image image = modelService.get(Image.class, id);
			if (image == null) {
				throw new EndUserException("Could not load image with id=" + id);
			}
			file = imageService.getImageFile(image);
			mime = image.getContentType();
		}
		if ("application/octet-stream".equals(mime)) {
			mime = "image/jpeg";
		}
		FilePusher pusher = new FilePusher(file);
		pusher.setClientSideCaching(true);
		pusher.setDownload(request.getBoolean("download"));
		pusher.push(request.getResponse(), mime);
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

}
