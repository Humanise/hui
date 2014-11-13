package dk.in2isoft.commons.jsf;

import java.util.Locale;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.ui.Request;

public class AbstractView {

	public AbstractView() {
		super();
	}

	protected Request getRequest() {
		FacesContext ctx = FacesContext.getCurrentInstance();
		if (ctx==null) {
			return null;
		}
		ExternalContext context = ctx.getExternalContext();
		return Request.get((HttpServletRequest) context.getRequest(),(HttpServletResponse) context.getResponse());
	}
	
	public Locale getLocale() {
		return FacesContext.getCurrentInstance().getViewRoot().getLocale();
	}
	
	public String getBaseContext() {
		return getRequest().getBaseContext();
	}
	
	public String getBaseDomainContext() {
		return getRequest().getBaseDomainContext();
	}
	
	public String getLocalContext() {
		return getRequest().getLocalContext();
	}
	
	public boolean getIsIP() {
		return getRequest().isIP();
	}

	public String getUserName() {
		return getRequest().getSession().getUser().getUsername();
	}
	
	public boolean isPublicUser() {
		return SecurityService.PUBLIC_USERNAME.equals(getUserName());
	}
}