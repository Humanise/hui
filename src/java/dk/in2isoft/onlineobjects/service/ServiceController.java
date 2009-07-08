package dk.in2isoft.onlineobjects.service;

import java.io.File;
import java.io.IOException;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class ServiceController {

	private String name;

	public ServiceController(String name) {
		super();
		this.name = name;
	}
	
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		
	}

	protected ModelService getModel() {
		return Core.getInstance().getModel();
	}
	
	public File getFile(String... path) {
		StringBuilder filePath = new StringBuilder();
		filePath.append(Core.getInstance().getConfiguration().getBaseDir());
		filePath.append(File.separator);
		filePath.append("WEB-INF");
		filePath.append(File.separator);
		filePath.append("services");
		filePath.append(File.separator);
		filePath.append(name);
		for (int i = 0; i < path.length; i++) {
			filePath.append(File.separator);
			filePath.append(path[i]);
		}
		return new File(filePath.toString());
	}
}
