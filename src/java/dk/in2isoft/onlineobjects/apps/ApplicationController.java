package dk.in2isoft.onlineobjects.apps;

import java.io.File;
import java.io.IOException;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.ConfigurationException;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.events.EventManager;
import dk.in2isoft.onlineobjects.core.events.ModelEventListener;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class ApplicationController implements ModelEventListener {

	private static Logger log = Logger.getLogger(ApplicationController.class); 
	
	private String name;
	
	public ApplicationController(String name) {
		this.name = name;
		EventManager.getInstance().addModelEventListener(this);
	}
	
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		
	}

	protected final ModelFacade getModel() {
		return Core.getInstance().getModel();
	}
	
	public ApplicationSession createToolSession() {
		return null;
	}

	public void itemWasCreated(Item item) {
	}

	public void itemWasUpdated(Item item) {
	}
	
	public File getFile(String... path) {
		StringBuilder filePath = new StringBuilder();
		try {
			filePath.append(Core.getInstance().getConfiguration().getBaseDir());
		} catch (ConfigurationException e) {
			log.error("Unable to get configuration", e);
			throw new IllegalStateException("Unable to get configuration",e);
		}
		filePath.append(File.separator);
		filePath.append("WEB-INF");
		filePath.append(File.separator);
		filePath.append("apps");
		filePath.append(File.separator);
		filePath.append(name);
		for (int i = 0; i < path.length; i++) {
			filePath.append(File.separator);
			filePath.append(path[i]);
		}
		return new File(filePath.toString());
	}
}
