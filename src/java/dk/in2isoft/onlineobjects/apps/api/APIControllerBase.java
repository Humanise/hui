package dk.in2isoft.onlineobjects.apps.api;

import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.modules.inbox.InboxService;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class APIControllerBase extends ApplicationController {
	
	protected LanguageService languageService;
	protected HTMLService htmlService;
	protected SecurityService securityService;
	protected InboxService inboxService;

	protected static final Blend publicScript;
	
	static {

		publicScript = new Blend("api_public_script");
		publicScript.addPath("hui","js","hui.js");
		publicScript.addPath("hui","js","hui_animation.js");
		publicScript.addPath("hui","js","ui.js");
		publicScript.addPath("WEB-INF","apps","api","web","js","script.js");
	}
	
	public APIControllerBase() {
		super("api");
	}

	public List<Locale> getLocales() {
		return Lists.newArrayList(new Locale("en"),new Locale("da"));
	}

	@Override
	public String getLanguage(Request request) {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			return path[0];
		}
		return super.getLanguage(request);
	}

	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setInboxService(InboxService inboxService) {
		this.inboxService = inboxService;
	}

}