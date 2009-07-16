package dk.in2isoft.commons.util;

import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;

public class ImageUtil extends AbstractCommandLineInterfaceUtil {

	private static Logger log = Logger.getLogger(ImageUtil.class);

	public static File getThumbnail(long id, int size) throws EndUserException {
		return getThumbnail(id, size, size);

	}

	public static File getThumbnail(long id, int width, int height) throws EndUserException {
		File folder = Core.getInstance().getStorageService().getItemFolder(id);
		File original = new File(folder, "original");
		if (!original.isFile()) {
			throw new EndUserException("The image with id=" + id + " does not exist");
		}
		File converted = new File(folder, "thumbnail-" + width + "x" + height + ".jpg");
		if (!converted.exists()) {
			String cmd = Core.getInstance().getConfiguration().getImageMagickPath() + "/convert -thumbnail " + width
					+ "x" + height + " " + original.getAbsolutePath() + "[0] " + converted.getAbsolutePath();
			execute(cmd);
		}
		return converted;
	}

	public static File getCroppedThumbnail(long id, int width, int height) throws EndUserException {
		File folder = Core.getInstance().getStorageService().getItemFolder(id);
		File original = new File(folder, "original");
		if (!original.isFile()) {
			throw new EndUserException("The image with id=" + id + " does not exist");
		}
		File converted = new File(folder, "thumbnail-" + width + "x" + height + "cropped.jpg");
		if (!converted.exists()) {
			String cmd = Core.getInstance().getConfiguration().getImageMagickPath() + "/convert -size " + (width * 3)
					+ "x" + (height * 3) + " " + original.getAbsolutePath() + " -thumbnail x" + (height * 2)
					+ "   -resize " + (width * 2) + "x<   -resize 50% -gravity center -crop " + width + "x" + height
					+ "+0+0  +repage " + converted.getAbsolutePath();
			execute(cmd);
		}
		return converted;
	}

	public static int[] getImageDimensions(File file) throws EndUserException {
		int[] dimensions = new int[] { 0, 0 };
		log.debug(file.getAbsolutePath());
		log.debug("Exists: " + file.exists());
		String cmd = Core.getInstance().getConfiguration().getImageMagickPath() + "/identify -quiet -format \"%wx%h\" "
				+ file.getAbsolutePath() + "[0]";
		String result = execute(cmd).trim();
		Pattern pattern = Pattern.compile(".*\"([0-9]+)x([0-9]+)\"");
		Matcher matcher = pattern.matcher(result);
		if (matcher.matches()) {
			dimensions[0] = Integer.parseInt(matcher.group(1));
			dimensions[1] = Integer.parseInt(matcher.group(2));
		} else {
			throw new EndUserException("Could not parse output: " + result);
		}
		return dimensions;
	}
}
