package dk.in2isoft.onlineobjects.apps;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URL;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;

import org.apache.commons.configuration.AbstractConfiguration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.util.RestUtil;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.StupidProgrammerException;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.core.events.ModelEventListener;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class ApplicationController implements ModelEventListener,InitializingBean {

	private static Logger log = Logger.getLogger(ApplicationController.class);

	private String name;
	private Map<Pattern,String> jsfMatchers = new LinkedHashMap<Pattern, String>();

	protected EventService eventService;
	protected ConfigurationService configurationService;
	protected ModelService modelService;
	
	private XMLConfiguration config;

	public ApplicationController(String name) {
		this.name = name;
	}
	

	public void afterPropertiesSet() throws Exception {
		eventService.addModelEventListener(this);
	}


	public AbstractConfiguration getConfig() {
		if (config == null) {
			URL url = this.getClass().getClassLoader().getResource(this.name + ".cfg.xml");
			try {
				config = new XMLConfiguration(url);
			} catch (ConfigurationException e) {
				log.error(e.getMessage(), e);
				return null;
			}
		}
		return config;
	}
	
	protected void addJsfMatcher(String pattern,String path) {
		jsfMatchers.put(RestUtil.compile(pattern), "/jsf/"+this.name+"/"+path);
	}

	public RequestDispatcher getDispatcher(Request request) {
		ServletContext context = request.getRequest().getSession().getServletContext();
		String localPath = request.getLocalPathAsString();
		String jsfPath = null;
		for (Map.Entry<Pattern, String> entry : jsfMatchers.entrySet()) {
			if (entry.getKey().matcher(localPath).matches()) {
				jsfPath = entry.getValue();
				break;
			}
		}
		if (jsfPath==null) {
			StringBuilder filePath = new StringBuilder();
			filePath.append(File.separator).append("jsf");
			filePath.append(File.separator).append(name);
			String[] path = request.getLocalPath();
			for (String item : path) {
				filePath.append(File.separator).append(item);
			}
			jsfPath = filePath.toString().replaceAll("\\.html", ".xhtml");
		}
		File file = new File(configurationService.getBasePath() + jsfPath);
		if (file.exists()) {
			return context.getRequestDispatcher("/faces"+jsfPath);
		}
		return null;
	}

	public void unknownRequest(Request request) throws IOException, EndUserException {
		Method[] methods = getClass().getDeclaredMethods();
		for (Method method : methods) {
			Path annotation = method.getAnnotation(Path.class);
			
			if (annotation!=null && request.testLocalPathStart(annotation.start())) {
				try {
					method.invoke(this, new Object[] { request });
					return;
				} catch (IllegalArgumentException e) {
					throw new StupidProgrammerException(e);
				} catch (IllegalAccessException e) {
					throw new EndUserException(e);
				} catch (InvocationTargetException e) {
					Throwable cause = e.getCause();
					if (cause!=null) {
						throw new EndUserException(cause);
					} else {
						throw new EndUserException(e);
					}
				}
			}
		}
		throw new ContentNotFoundException(request.getLocalPathAsString());
	}

	public ApplicationSession createToolSession() {
		return new ApplicationSession();
	}

	public void itemWasCreated(Item item) {
	}

	public void itemWasUpdated(Item item) {
	}

	public void itemWasDeleted(Item item) {
	}

	public File getFile(String... path) {
		StringBuilder filePath = new StringBuilder();
		filePath.append(configurationService.getBasePath());
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
		if (localPath.length > 0 && localPath[localPath.length - 1].endsWith(".gui")) {
			localPath[localPath.length - 1] = localPath[localPath.length - 1] + ".xml";
			file = getFile(Strings.combine("web", localPath));
		} else {
			file = getFile(Strings.combine("web", localPath, "index.gui.xml"));
		}
		if (file.exists()) {
			FileBasedInterface ui = new FileBasedInterface(file);
			ui.render(request.getRequest(), request.getResponse());
			return true;
		} else {
			return false;
		}
	}

	public void setEventService(EventService eventService) {
		this.eventService = eventService;
	}

	public EventService getEventService() {
		return eventService;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public boolean isAllowed(Request request) {
		return true;
	}

	public String getLanguage(Request request) {
		return null;
	}

}
