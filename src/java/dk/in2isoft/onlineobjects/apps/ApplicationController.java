package dk.in2isoft.onlineobjects.apps;

import java.io.File;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.util.RestUtil;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.core.events.ModelEventListener;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.ui.AbstractController;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class ApplicationController extends AbstractController implements ModelEventListener,InitializingBean {

	//private static Logger log = Logger.getLogger(ApplicationController.class);

	private String name;
	private Map<Pattern,String> jsfMatchers = new LinkedHashMap<Pattern, String>();

	protected EventService eventService;
	protected ModelService modelService;
	
	public ApplicationController(String name) {
		this.name = name;
	}
	

	public void afterPropertiesSet() throws Exception {
		
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

	public ApplicationSession createToolSession() {
		return new ApplicationSession();
	}

	public void entityWasCreated(Entity entity) {
		
	}
	
	public void entityWasDeleted(Entity entity) {
		
	}
	
	public void entityWasUpdated(Entity entity) {
		
	}
	
	public void relationWasCreated(Relation relation) {
	}
	
	public void relationWasDeleted(Relation relation) {
	}

	public void relationWasUpdated(Relation relation) {
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
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public boolean isAllowed(Request request) {
		return true;
	}

	public String getLanguage(Request request) {
		return null;
	}

}
