package dk.in2isoft.onlineobjects.util.images;

import java.io.File;
import dk.in2isoft.commons.util.AbstractCommandLineInterface;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.StorageService;

public class ImageTransformationService extends AbstractCommandLineInterface {
	
	private StorageService storageService;
	private ConfigurationService configurationService;

	public File transform(long id, ImageTransformation transform) throws EndUserException {
		File folder = storageService.getItemFolder(id);
		File original = new File(folder, "original");
		if (!original.isFile()) {
			throw new ContentNotFoundException("The image with id=" + id + " does not exist");
		}
		File converted = new File(folder, getFileName(transform));
		if (!converted.exists()) {
			String cmd = buildImageMagick(original, transform, converted);
			execute(cmd);
		}
		return converted;
	}
	
	public void transform(File original, ImageTransformation transform, File converted) throws EndUserException {
		if (!original.isFile()) {
			throw new ContentNotFoundException("The file does not exist");
		}
		if (!converted.exists()) {
			String cmd = buildImageMagick(original, transform, converted);
			execute(cmd);
		}
	}

	private String getFileName(ImageTransformation transformation) {
		StringBuilder sb = new StringBuilder();
		sb.append("transformed");
		if (transformation.getWidth()>0) {
			sb.append("_width").append(transformation.getWidth());
		}
		if (transformation.getHeight()>0) {
			sb.append("_height").append(transformation.getHeight());
		}
		if (transformation.isCropped()) {
			sb.append("_cropped");
		}
		if (transformation.getSharpen()>0) {
			sb.append("_sharpen").append(transformation.getSharpen());
		}
		if (transformation.getSepia()>0) {
			sb.append("_sepia").append(transformation.getSepia());
		}
		if (transformation.getRotation()!=0) {
			sb.append("_rotation").append(transformation.getRotation());
		}
		if (transformation.isFlipHorizontally()) {
			sb.append("_flip-h");
		}
		if (transformation.isFlipVertically()) {
			sb.append("_flip-v");
		}
		return sb.toString();
	}
	
	private String buildImageMagick(File original, ImageTransformation transform, File converted) {
		StringBuilder sb = new StringBuilder();
		sb.append(configurationService.getImageMagickPath());
		sb.append("/convert");
		if (transform.getRotation()!=0) {
			sb.append(" -rotate ").append(transform.getRotation()).append("");
		}
		if (transform.getHeight()>0 && transform.getWidth()>0) {
			int width = transform.getWidth();
			int height = transform.getHeight();
			if (transform.isCropped()) {
				sb.append(" -size ").append(width * 3).append("x").append(height * 3);
				sb.append(" ").append(original.getAbsolutePath()).append(" -thumbnail x").append(height * 2);
				sb.append("   -resize ").append(width * 2).append("x< -resize 50% -gravity center -crop ").append(width).append("x").append(height);
				sb.append("+0+0  +repage ");
			} else {
				sb.append(" -thumbnail ").append(width).append("x").append(height);
				sb.append(" ").append(original.getAbsolutePath()).append("[0] ");
			}
		} else {
			sb.append(" ").append(original.getAbsolutePath()).append("[0] ");
		}
		if (transform.getSharpen()>0) {
			sb.append(" -sharpen 0x").append(transform.getSharpen());
		}
		if (transform.getSepia()>0) {
			sb.append(" -sepia-tone ").append(Math.round(transform.getSepia()*100)).append("%");
		}
		if (transform.isFlipHorizontally()) {
			sb.append(" -flop");
		}
		if (transform.isFlipVertically()) {
			sb.append(" -flip");
		}
		sb.append(" ").append(converted.getAbsolutePath());
		
		
		return sb.toString();
	}
		
	public void setStorageService(StorageService storageService) {
		this.storageService = storageService;
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
}
