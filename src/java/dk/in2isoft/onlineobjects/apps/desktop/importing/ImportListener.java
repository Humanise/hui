package dk.in2isoft.onlineobjects.apps.desktop.importing;

import java.io.File;

import dk.in2isoft.commons.http.URLUtil;
import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.util.images.ImageProperties;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ImportListener {
	
	//private Logger log = Logger.getLogger(ImportListener.class);
	
	private ImageService imageService;
	private Privileged privileged; 
	
	public Entity urlWasImported(File file, String uri, String mimeType) throws ModelException {
		String name = URLUtil.toFileName(uri);
		return fileWasImported(file, name, mimeType);
	}
	
	public Entity fileWasImported(File file, String fileName, String mimeType) throws ModelException {
		ImageProperties properties = imageService.getImageProperties(file);
		if (properties!=null) {
			String name = Files.cleanFileName(fileName);
			return imageService.createImageFromFile(file, name, privileged);
		}
		return null;
	}
	
	public void setPrivileged(Privileged privileged) {
		this.privileged = privileged;
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}
	
}
