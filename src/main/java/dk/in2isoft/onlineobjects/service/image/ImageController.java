package dk.in2isoft.onlineobjects.service.image;

import java.io.File;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import dk.in2isoft.commons.http.FilePusher;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;
import dk.in2isoft.onlineobjects.util.images.ImageTransformation;
import dk.in2isoft.onlineobjects.util.images.ImageTransformationService;

public class ImageController extends ServiceController {

	private ImageService imageService;
	private ModelService modelService;
	private ImageTransformationService imageTransformationService;
	
	private Pattern idPattern;
	private Pattern widthPattern;
	private Pattern heightPattern;
	private Pattern thumbnailPattern;
	private Pattern sharpenPattern;
	private Pattern sepiaPattern;
	private Pattern rotationPattern;

	public ImageController() {
		super("image");
		idPattern = Pattern.compile("id([0-9]+)");
		widthPattern = Pattern.compile("width([0-9]+)");
		heightPattern = Pattern.compile("height([0-9]+)");
		thumbnailPattern = Pattern.compile("thumbnail([0-9]+)");
		sharpenPattern = Pattern.compile("sharpen([0-9]+\\.[0-9]+)");
		sepiaPattern = Pattern.compile("sepia([0-9]+\\.[0-9]+)");
		rotationPattern = Pattern.compile("rotation([\\-]?[0-9]+\\.[0-9]+)");
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		if (configurationService.isSimulateSlowRequest()) {
			try {
				Thread.sleep(Math.round(Math.random()*3000+1000));
			} catch (InterruptedException ignore) {}
		}
		String[] path = request.getLocalPath();
		Parameters param = new Parameters();
		if (path.length>0) {
			String subject = path[path.length-1];
			param.id = Long.valueOf(match(idPattern,subject));
			param.width = parseInt(match(widthPattern,subject));
			param.height = parseInt(match(heightPattern,subject));
			param.thumbnail = parseInt(match(thumbnailPattern,subject));
			param.sharpen = parseFloat(match(sharpenPattern,subject));
			param.sepia = parseFloat(match(sepiaPattern,subject));
			param.cropped = subject.indexOf("cropped")!=-1;
			param.rotation = parseFloat(match(rotationPattern,subject));
			param.verticalFlip = subject.contains("flipv");
			param.horizontalFlip = subject.contains("fliph");
			param.inherit = subject.contains("inherit");
		} else {
			param.id = request.getLong("id");
			param.thumbnail = request.getInt("thumbnail");
			param.width = request.getInt("width");
			param.height = request.getInt("height");
			param.cropped = request.getBoolean("cropped");
			param.sharpen = request.getFloat("sharpen");
			param.sepia = request.getFloat("sepia");
			param.rotation = request.getFloat("rotation");
			param.verticalFlip = request.getBoolean("flipVertically");
			param.horizontalFlip = request.getBoolean("flipHorizontally");
			param.inherit = request.getBoolean("inherit");
		}
		process(request,param);
	}
	
	private int parseInt(String str) {
		if (str==null) {
			return 0;
		} else {
			return Integer.valueOf(str);
		}
	}

	private float parseFloat(String str) {
		if (str==null) {
			return 0f;
		} else {
			return Float.valueOf(str);
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

	private void process(Request request, Parameters parameters) throws IOException, EndUserException {		
		File file;
		Image image = modelService.get(Image.class, parameters.id, request.getSession());
		if (image==null) {
			throw new ContentNotFoundException("The image could not be found, id="+parameters.id);
		}
		String mime;
		ImageTransformation trans = new ImageTransformation();
		trans.setCropped(parameters.cropped);
		if (parameters.thumbnail>0) {
			trans.setHeight(parameters.thumbnail);
			trans.setWidth(parameters.thumbnail);
		} else {
			trans.setHeight(parameters.height);
			trans.setWidth(parameters.width);
		}
		trans.setSharpen(parameters.sharpen);
		trans.setSepia(parameters.sepia);
		trans.setRotation(parameters.rotation);
		trans.setFlipHorizontally(parameters.horizontalFlip);
		trans.setFlipVertically(parameters.verticalFlip);
		if (parameters.inherit) {
			boolean flipVertically = image.getPropertyBooleanValue(Property.KEY_PHOTO_FLIP_VERTICALLY);
			boolean flipHorizontally = image.getPropertyBooleanValue(Property.KEY_PHOTO_FLIP_HORIZONTALLY);
			Double rotation = image.getPropertyDoubleValue(Property.KEY_PHOTO_ROTATION);
			trans.setFlipHorizontally(flipHorizontally);
			trans.setFlipVertically(flipVertically);
			if (rotation!=null) {
				trans.setRotation(rotation.longValue());
			}
		}
		
		
		if (trans.isTransformed()) {
			file = imageTransformationService.transform(parameters.id, trans);
			mime = "image/jpeg";			
		} else {
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

	// Wiring...
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public void setImageTransformationService(ImageTransformationService imageTransformationService) {
		this.imageTransformationService = imageTransformationService;
	}
	
	private class Parameters {
		long id;
		int width;
		int height;
		int thumbnail;
		float sharpen;
		float sepia;
		boolean cropped;
		float rotation;
		boolean verticalFlip;
		boolean horizontalFlip;
		boolean inherit;
	}
}
