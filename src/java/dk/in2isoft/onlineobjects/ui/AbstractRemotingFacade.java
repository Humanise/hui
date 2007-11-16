package dk.in2isoft.onlineobjects.ui;

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
}
