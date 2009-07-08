package dk.in2isoft.onlineobjects.apps.community.jsf;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityController;
import dk.in2isoft.onlineobjects.ui.Request;

public class AbstractManagedBean {

	public AbstractManagedBean() {
		super();
	}

	protected Request getRequest() {
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		return new Request((HttpServletRequest) context.getRequest(),(HttpServletResponse) context.getResponse());
	}
	
	public String getBaseContext() {
		return getRequest().getBaseContext();
	}
	
	public String getBaseDomainContext() {
		return getRequest().getBaseDomainContext();
	}
	
	public String getLocalContext() {
		return getRequest().getLocalContextPath();
	}
	
	public boolean getIsIP() {
		return getRequest().isIP();
	}

	protected ModelService getModel() {
		return Core.getInstance().getModel();
	}
	
	public boolean isDevelopmentMode() {
		Request request = getRequest();
		if (request.isSet("dev")) {
			return request.getBoolean("dev");
		} else {
			return Core.getInstance().getConfiguration().getDevelopmentMode();
		}
	}

	public String getUserName() {
		return getRequest().getSession().getUser().getUsername();
	}
	
	public boolean isPublicUser() {
		return SecurityController.PUBLIC_USERNAME.equals(getUserName());
	}
}