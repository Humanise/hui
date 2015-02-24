package dk.in2isoft.onlineobjects.ui;

import java.lang.reflect.Method;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.directwebremoting.AjaxFilter;
import org.directwebremoting.AjaxFilterChain;
import org.directwebremoting.WebContextFactory;

import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.modules.surveillance.SurveillanceService;

public class DWRFilter implements AjaxFilter {
	
	private static Logger log = Logger.getLogger(AjaxFilter.class);
	
	public Object doFilter(Object obj, Method method, Object[] params, AjaxFilterChain chain) throws Exception {
		try {
			if (obj instanceof AbstractRemotingFacade) {
				AbstractRemotingFacade facade = (AbstractRemotingFacade) obj;
				if (!facade.isAccessAllowed(method)) {
					throw new SecurityException("Access not allowed");
				}
			}
			return chain.doFilter(obj, method, params);
		} catch (Exception e) {
			Throwable cause = e.getCause();
			if (cause!=null) {
				log.error(cause.getMessage(), cause);
			} else {
				log.error(e.getMessage(), e);
			}
			HttpServletRequest request = WebContextFactory.get().getHttpServletRequest();
			HttpServletResponse response = WebContextFactory.get().getHttpServletResponse();
			request.setAttribute("dwr-exception", new Boolean(true));

			if (obj instanceof AbstractRemotingFacade) {
				AbstractRemotingFacade facade = (AbstractRemotingFacade) obj;
				SurveillanceService bean = facade.getRequest().getBean(SurveillanceService.class);
				bean.survey(e,Request.get(request, response));
			}
			throw e;
		}
	}
}