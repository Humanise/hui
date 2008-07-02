package dk.in2isoft.onlineobjects.ui;

import javax.servlet.http.HttpServletRequest;

import org.directwebremoting.WebContextFactory;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.UserSession;

public abstract class AbstractRemotingFacade {

	
	protected UserSession getUserSession() {
		return UserSession.getUserSession(WebContextFactory.get().getHttpServletRequest());
	}
	
	protected ModelFacade getModel() {
		return Core.getInstance().getModel();
	}
	
	protected Request getRequest() {
		return new Request(WebContextFactory.get().getHttpServletRequest(),WebContextFactory.get().getHttpServletResponse());
	}
	
	protected HttpServletRequest getHttpRequest() {
		return WebContextFactory.get().getHttpServletRequest();
	}
}
