package dk.in2isoft.onlineobjects.ui;

import java.lang.reflect.Method;

import javax.servlet.http.HttpServletRequest;

import org.directwebremoting.WebContextFactory;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;

public abstract class AbstractRemotingFacade {

	protected ModelService modelService;
	
	protected UserSession getUserSession() {
		return getRequest().getSession();
	}
	
	protected Request getRequest() {
		return Request.get(WebContextFactory.get().getHttpServletRequest(),WebContextFactory.get().getHttpServletResponse());
	}
	
	protected HttpServletRequest getHttpRequest() {
		return WebContextFactory.get().getHttpServletRequest();
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}
	
	public boolean isAccessAllowed(Method method) throws SecurityException {
		return true;
	}
}
