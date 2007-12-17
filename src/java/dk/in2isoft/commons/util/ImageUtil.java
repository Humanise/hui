package dk.in2isoft.commons.util;

import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.Image;

public class ImageUtil extends AbstractCommandLineInterfaceUtil {
	
	private static Logger log = Logger.getLogger(ImageUtil.class);

	
	public static File getThumbnail(Image image,int size)
	throws EndUserException {
		File folder = Core.getInstance().getStorage().getItemFolder(image);
		File converted = new File(folder,"thumbnail-"+size+"x"+size+".jpg");
		if (!converted.exists()) {
			String cmd = Core.getInstance().getConfiguration().getImageMagickPath()+"/convert -thumbnail "+size+"x"+size+" "+image.getImageFile().getAbsolutePath()+"[0] "+converted.getAbsolutePath();
			execute(cmd);
		}
		return converted;
	}
	
	public static File getThumbnail(Image image,int width, int height)
	throws EndUserException {
		File folder = Core.getInstance().getStorage().getItemFolder(image);
		File converted = new File(folder,"thumbnail-"+width+"x"+height+".jpg");
		if (!converted.exists()) {
			String cmd = Core.getInstance().getConfiguration().getImageMagickPath()+"/convert -thumbnail "+width+"x"+height+" "+image.getImageFile().getAbsolutePath()+"[0] "+converted.getAbsolutePath();
			execute(cmd);
		}
		return converted;
	}
	
	public static int[] getImageDimensions(File file) throws EndUserException {
		int[] dimensions = new int[] {0,0};
		log.debug(file.getAbsolutePath());
		log.debug("Exists: "+file.exists());
		String cmd = Core.getInstance().getConfiguration().getImageMagickPath()+"/identify -quiet -format \"%wx%h\" "+file.getAbsolutePath()+"[0]";
		String result = execute(cmd).trim();
		Pattern pattern = Pattern.compile(".*\"([0-9]+)x([0-9]+)\"");
		Matcher matcher = pattern.matcher(result);
		if (matcher.matches()) {
			dimensions[0]=Integer.parseInt(matcher.group(1));
			dimensions[1]=Integer.parseInt(matcher.group(2));
		} else {
			throw new EndUserException("Could not parse output: "+result);
		}
		return dimensions;
	}
}
