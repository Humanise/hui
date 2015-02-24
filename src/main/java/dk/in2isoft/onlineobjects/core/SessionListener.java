package dk.in2isoft.onlineobjects.core;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import dk.in2isoft.onlineobjects.services.SessionService;

public class SessionListener implements HttpSessionListener {

	public void sessionCreated(HttpSessionEvent event) {
		getSessionService(event).sessionCreated(event);
	}

	public void sessionDestroyed(HttpSessionEvent event) {
		getSessionService(event).sessionDestroyed(event);
	}

	private SessionService getSessionService(HttpSessionEvent event) {
		ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(event.getSession().getServletContext());
		SessionService bean = (SessionService) context.getBean("sessionService",SessionService.class);
		return bean;
	}
}
