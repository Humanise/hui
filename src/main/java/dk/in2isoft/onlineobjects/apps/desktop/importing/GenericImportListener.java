package dk.in2isoft.onlineobjects.apps.desktop.importing;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.modules.importing.ImportListener;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageProperties;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class GenericImportListener implements ImportListener<Entity> {
	
	private ImageService imageService;
	private Privileged privileged;
	private HTMLService htmlService;
	
	private Entity result;
	
	@Override
	public void processFile(File file, String mimeType, String name, Map<String, String> parameters, Request request) throws IOException, EndUserException {
		ImageProperties properties = imageService.getImageProperties(file);
		if (properties!=null) {
			name = Files.cleanFileName(name);
			result = imageService.createImageFromFile(file, name, privileged);
			return;
		}
		htmlService.getDocumentSilently(file,null);
	}

	@Override
	public Entity getResponse() {
		return result;
	}
	
	public void setPrivileged(Privileged privileged) {
		this.privileged = privileged;
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}

	@Override
	public String getProcessName() {
		return null;
	}
	
}
