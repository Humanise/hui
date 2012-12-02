package dk.in2isoft.onlineobjects.services;

import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;

import org.apache.log4j.Logger;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.SubSession;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;

public class SessionService {

	private static final Logger log = Logger.getLogger(SessionService.class);
	
	private int activeSessionCount;
	
	private List<SubSession> subSessions = Lists.newArrayList();
	
	private List<UserSession> userSessions = Lists.newArrayList();

	private SecurityService securityService;

	public void sessionCreated(HttpSessionEvent event) {
		HttpSession session = event.getSession();
		//session.setMaxInactiveInterval(60);
		activeSessionCount++;
		log.debug("Session created: id="+session.getId()+",interval="+session.getMaxInactiveInterval());
		try {
			UserSession userSession = securityService.ensureUserSession(session);
			userSessions.add(userSession);
		} catch (SecurityException e) {
			log.error("Unable to ensure user session",e);
		}
	}

	public void sessionDestroyed(HttpSessionEvent event) {
		activeSessionCount--;
		log.debug("Session destroyed: "+event.getSession().getId());
		UserSession userSession = UserSession.get(event.getSession());
		if (userSession!=null) {
			userSessions.remove(userSession);
			for (Iterator<SubSession> iterator = subSessions.iterator(); iterator.hasNext();) {
				SubSession subSession = iterator.next();
				if (subSession.getUserSessionId().equals(userSession.getId())) {
					log.debug("Removed sub session");
					iterator.remove();
				}
				
			}
		} else {
			log.warn("No user session for http session: "+event.getSession().getId());
		}
	}
	
	public void registerSubSeession(SubSession subSession) {
		this.subSessions.add(subSession);
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	@SuppressWarnings("unchecked")
	public <T extends SubSession> T  getSubSession(String id, Class<T> type) {
		for (SubSession subSession : subSessions) {
			if (subSession.getId().equals(id) && type.isAssignableFrom(subSession.getClass())) {
				return (T) subSession;
			}
		}
		return null;
	}
}
