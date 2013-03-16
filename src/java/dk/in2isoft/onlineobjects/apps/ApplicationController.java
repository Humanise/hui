package dk.in2isoft.onlineobjects.apps;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.core.events.ModelEventListener;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.ui.AbstractController;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class ApplicationController extends AbstractController implements ModelEventListener,InitializingBean {

	protected EventService eventService;
	protected ModelService modelService;
	
	public ApplicationController(String name) {
		super(name);
	}
	

	public void afterPropertiesSet() throws Exception {
		
	}
	
	public abstract List<Locale> getLocales();

	
	public String getMountPoint() {
		return getName();
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
	
	@Override
	protected String getDimension() {
		return "apps";
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

	public boolean askForUserChange(Request request) {
		return false;
	}

}
