package dk.in2isoft.onlineobjects.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

public class ServiceManager {

	private static ServiceManager instance;
	private static Logger log = Logger.getLogger(ServiceManager.class);
	
	private Map<String, ServiceController> controllers;

	private ServiceManager() {
		super();
		this.controllers = new HashMap<String, ServiceController>();
	}

	public static ServiceManager getInstance() {
		if (instance == null) {
			instance = new ServiceManager();
		}
		return instance;
	}

	public ServiceController getServiceController(String toolName) {
		if (controllers.containsKey(toolName)) {
			return controllers.get(toolName);
		} else {
			ServiceController controller = loadNewController(toolName);
			if (controller != null) {
				controllers.put(toolName, controller);
				return controller;
			} else {
				return null;
			}
		}
	}

	private ServiceController loadNewController(String toolName) {
		ServiceController controller = null;
		StringBuilder className = new StringBuilder();
		className.append("dk.in2isoft.onlineobjects.service.");
		className.append(toolName);
		className.append(".");
		className.append(StringUtils.capitalize(toolName));
		className.append("Controller");
		try {
			Class<?> toolClass = Class.forName(className.toString());
			controller = (ServiceController) toolClass.newInstance();
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
