package dk.in2isoft.onlineobjects.apps;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

public class ApplicationManager {

	private static ApplicationManager instance;
	private static Logger log = Logger.getLogger(ApplicationManager.class);
	
	private Map<String, ApplicationController> controllers;

	private ApplicationManager() {
		super();
		this.controllers = new HashMap<String, ApplicationController>();
	}

	public static ApplicationManager getInstance() {
		if (instance == null) {
			instance = new ApplicationManager();
		}
		return instance;
	}

	public ApplicationController getToolController(String toolName) {
		if (controllers.containsKey(toolName)) {
			return controllers.get(toolName);
		} else {
			ApplicationController controller = loadNewController(toolName);
			if (controller != null) {
				controllers.put(toolName, controller);
				return controller;
			} else {
				return null;
			}
		}
	}

	private ApplicationController loadNewController(String toolName) {
		ApplicationController controller = null;
		StringBuilder className = new StringBuilder();
		className.append("dk.in2isoft.onlineobjects.apps.");
		className.append(toolName);
		className.append(".");
		className.append(StringUtils.capitalize(toolName));
		className.append("Controller");
		try {
			Class<?> toolClass = Class.forName(className.toString());
			controller = (ApplicationController) toolClass.newInstance();
		} catch (ClassNotFoundException e) {
			log.warn(e);
		} catch (IllegalAccessException e) {
			log.warn(e);
		} catch (InstantiationException e) {
			log.warn(e);
		}
		return controller;
	}
}
