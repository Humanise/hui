package dk.in2isoft.onlineobjects.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.model.Application;

public class ApplicationService {

	private static Logger log = Logger.getLogger(ApplicationService.class);
	
	private Map<String, ApplicationController> controllers;

	public ApplicationService() {
		super();
		this.controllers = new HashMap<String, ApplicationController>();
	}

	public ApplicationController getController(String toolName) {
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

	public void registerApplications(List<Application> apps) {
		for (Application application : apps) {
			registerApplication(application);
		}
	}

	public void registerApplication(Application application) {
		getController(application.getName());
	}
}
