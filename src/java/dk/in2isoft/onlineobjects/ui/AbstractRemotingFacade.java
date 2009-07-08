package dk.in2isoft.onlineobjects.ui;

import javax.servlet.http.HttpServletRequest;

import org.directwebremoting.WebContextFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.UserSession;

public abstract class AbstractRemotingFacade {

	
	protected UserSession getUserSession() {
		return UserSession.getUserSession(WebContextFactory.get().getHttpServletRequest());
	}
	
	protected ModelService getModel() {
		return getService(ModelService.class);
	}
	
	protected Request getRequest() {
		return new Request(WebContextFactory.get().getHttpServletRequest(),WebContextFactory.get().getHttpServletResponse());
	}
	
	protected HttpServletRequest getHttpRequest() {
		return WebContextFactory.get().getHttpServletRequest();
	}

	protected <T> T getService(Class<T> clas) {
		String name = clas.getSimpleName().substring(0, 1).toLowerCase()+clas.getSimpleName().substring(1);
		return (T) getContext().getBean(name, clas);
	}

	protected WebApplicationContext getContext() {
		return WebApplicationContextUtils.getWebApplicationContext(WebContextFactory.get().getServletContext());
	}
}
