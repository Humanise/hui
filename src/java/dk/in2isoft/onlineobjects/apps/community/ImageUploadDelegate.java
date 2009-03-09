package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public interface ImageUploadDelegate {
	
	public void handleFile(File file, String name, String contentType, Map<String,String> parameters, Request request) throws EndUserException;
}
