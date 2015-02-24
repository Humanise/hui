package dk.in2isoft.onlineobjects.modules.dispatch;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.FilterChain;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.LinkedHashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Application;
import dk.in2isoft.onlineobjects.services.DispatchingService;
import dk.in2isoft.onlineobjects.ui.Request;

public class ApplicationResponder extends AbstractControllerResponder implements Responder, InitializingBean {

	static Logger log = Logger.getLogger(ApplicationResponder.class);
	private static final Class<?>[] args = { Request.class };
	private Multimap<String, Pattern> mappings;
	
	private HashMap<String, ApplicationController> controllers;
	private DispatchingService dispatchingService;
	
	private Map<String,Method> methods;
	
	public ApplicationResponder() {
		methods = new HashMap<String, Method>();
	}
	
	public void afterPropertiesSet() throws Exception {
		String domain = configurationService.getRootDomain();
		
		List<Application> apps = Lists.newArrayList();
		
		for (ApplicationController ctrl : controllers.values()) {
			Application app = new Application();
			app.setName(ctrl.getName());
			app.addProperty(Application.PROPERTY_URL_MAPPING, ctrl.getMountPoint()+"."+domain);
			apps.add(app);
		}

		mappings = LinkedHashMultimap.create();

		for (Application app : apps) {
			for (String reg : app.getPropertyValues(Application.PROPERTY_URL_MAPPING)) {
				Pattern p = Pattern.compile(reg);
				mappings.put(app.getName(), p);
			}
		}
	}
	
	public boolean applies(Request request) {
		return true;
	}
	
	public Boolean dispatch(Request request, FilterChain chain) throws IOException, EndUserException {
		
		String[] path = request.getFullPath();
		if (configurationService.getRootDomain()==null && path.length>1 && path[0].equals("app")) {
			request.setLocalContext((String[]) ArrayUtils.subarray(path, 0, 2));
			callApplication(path[1], request);
		} else {
			String appName = resolveMapping(request);
			if (appName == null) {
				throw new ContentNotFoundException("Application not found");
			} else {
				callApplication(appName, request);
			}
		}
		return true;
	}
	
	private ApplicationController getApplicationController(Request request, String name) {
		return controllers.get(name);
	}

	private String resolveMapping(Request request) {
		String domainName = request.getDomainName();
		for (Entry<String, Pattern> mapping : mappings.entries()) {
			Pattern pattern = mapping.getValue();
			Matcher matcher = pattern.matcher(domainName);
			if (matcher.matches()) {
				return mapping.getKey();
			}
		}
		return null;
	}

	private void callApplication(String application, Request request) throws IOException, EndUserException {
		ApplicationController controller = getApplicationController(request,application);
		String[] path = request.getLocalPath();
		try {
			if (controller == null) {
				throw new ContentNotFoundException("Application not found: "+application);
			}
			request.setApplication(application);
			if (!controller.isAllowed(request)) {
				if (controller.askForUserChange(request)) {
					request.redirectFromBase("/service/authentication/?redirect="+request.getRequest().getRequestURI()+"&action=appAccessDenied&faultyuser="+request.getSession().getUser().getUsername());
					return;
				} else {
					dk.in2isoft.onlineobjects.core.exceptions.SecurityException exception = new dk.in2isoft.onlineobjects.core.exceptions.SecurityException("Application '"+application+"' denied access to user '"+request.getSession().getUser().getUsername()+"'");
					exception.setLog(controller.logAccessExceptions());
					throw exception;
				}
			}
			String language = controller.getLanguage(request);
			if (language!=null) {
				request.setLanguage(language);
			}
			RequestDispatcher dispatcher = controller.getDispatcher(request);
			if (dispatcher != null) {
				request.getResponse().setContentType("text/html");
				request.getResponse().setCharacterEncoding("UTF-8");
				dispatcher.forward(request.getRequest(), request.getResponse());
			} else {
				if (path.length > 0) {
					try {
						boolean called = callApplicationMethod(controller, path[0], request);
						if (!called) {
							String[] filePath = new String[] { "apps", application };
							if (!pushFile((String[]) ArrayUtils.addAll(filePath, path), request.getResponse())) {
								controller.unknownRequest(request);
							}
						}
					} catch (InvocationTargetException e) {
						dispatchingService.displayError(request, e);
					}
				} else {
					controller.unknownRequest(request);
				}
			}
		} catch (ServletException e) {
			dispatchingService.displayError(request, e);
		}
	}

	private boolean callApplicationMethod(ApplicationController controller, String methodName, Request request)
			throws EndUserException, InvocationTargetException {
		try {
			Method cached = methods.get(methodName);
			if (cached!=null) {
				cached.invoke(controller, new Object[] { request });
				return true;
			}
			Class<? extends ApplicationController> appClass = controller.getClass();
			Method method = appClass.getDeclaredMethod(methodName, args);
			boolean accessible = method.isAccessible();
			if (!accessible) {
				return false;				
			}
			method.invoke(controller, new Object[] { request });
			methods.put(methodName, method);
			return true;
		} catch (IllegalAccessException e) {
			return false;
		} catch (NoSuchMethodException e) {
			return false;
		}
	}

	
	public void setDispatchingService(DispatchingService dispatchingService) {
		this.dispatchingService = dispatchingService;
	}
	
	public void setApplicationControllers(List<ApplicationController> controllers) {
		this.controllers = new HashMap<String,ApplicationController>();
		for (ApplicationController controller : controllers) {
			this.controllers.put(controller.getName(), controller);
		}
	}
}
