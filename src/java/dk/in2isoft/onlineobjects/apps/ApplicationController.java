package dk.in2isoft.onlineobjects.apps;

import java.io.File;
import java.io.IOException;
import java.net.URL;

import org.apache.commons.configuration.AbstractConfiguration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.in2igui.FileBasedInterface;
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
	private XMLConfiguration config;
	
	
	public ApplicationController(String name) {
		this.name = name;
		EventManager.getInstance().addModelEventListener(this);
	}
	
	public AbstractConfiguration getConfig() {
		if (config==null) {
			URL url = this.getClass().getClassLoader().getResource(this.name+".cfg.xml");
			try {
				config = new XMLConfiguration(url);
			} catch (ConfigurationException e) {
				log.error(e.getMessage(),e);
				return null;
			}
		}
		return config;
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

	public void itemWasDeleted(Item item) {
	}
	
	public File getFile(String... path) {
		StringBuilder filePath = new StringBuilder();
		filePath.append(Core.getInstance().getConfiguration().getBaseDir());
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
	
	public boolean showGui(Request request) throws IOException {
		String[] localPath = request.getLocalPath();
		File file;
		if (localPath.length>0 && localPath[localPath.length-1].endsWith(".gui")) {
			localPath[localPath.length-1]=localPath[localPath.length-1]+".xml";
			file = getFile(LangUtil.combine("web",localPath));
		} else {
			file = getFile(LangUtil.combine("web",localPath,"index.gui.xml"));
		}
		if (file.exists()) {
			FileBasedInterface ui = new FileBasedInterface(file);
			ui.render(request.getRequest(), request.getResponse());
			return true;
		} else {
			return false;
		}
	}
}
