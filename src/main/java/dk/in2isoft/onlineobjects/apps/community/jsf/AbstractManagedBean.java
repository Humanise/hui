package dk.in2isoft.onlineobjects.apps.community.jsf;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.ui.Request;

public class AbstractManagedBean {

	public AbstractManagedBean() {
		super();
	}

	protected Request getRequest() {
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		return Request.get((HttpServletRequest) context.getRequest(),(HttpServletResponse) context.getResponse());
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