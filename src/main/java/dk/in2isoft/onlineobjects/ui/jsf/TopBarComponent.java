package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.inbox.InboxService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.Messages;

@FacesComponent(value=TopBarComponent.FAMILY)
public class TopBarComponent extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.topBar";
	
	public TopBarComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {};
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		ConfigurationService configurationService = Components.getBean(ConfigurationService.class);
		//boolean developmentMode = configurationService.isDevelopmentMode();
		Request request = Request.get(context);
		Messages msg = new Messages(this);
		boolean publicUser = !request.isLoggedIn();
		
		out.startDiv("oo_topbar oo_faded").withId(getClientId());
		out.startA("oo_topbar_logo").withHref(configurationService.getApplicationContext("front", null, request));
		out.startEm("oo_topbar_logo_icon oo_icon_onlineobjects").endEm();
		out.startStrong().startSpan().text("Online").startSpan().text("Objects").endSpan().endSpan().endStrong();
		out.endA();

		out.startUl("oo_topbar_left");
		/*
		out.startLi("oo_topbar_people").startA(request.isApplication("community") ? "oo_topbar_selected" : null);
		if (developmentMode) {
			out.withHref(request.getBaseContext()+"/");
		} else {
			out.withHref("http://www.onlineme.dk/");
		}
		out.write("Community").endA().endLi();*/
		
		List<String> primaryApps = Lists.newArrayList("words","photos","people");
		List<String> privateApps = Lists.newArrayList("reader","desktop","tools");
		if (request.isUser(SecurityService.ADMIN_USERNAME)) {
			privateApps.add("setup");
		}
		
		for (String app : primaryApps) {			
			out.startLi("oo_topbar_"+app).startA(request.isApplication(app) ? "oo_topbar_selected" : null);
			out.withHref(configurationService.getApplicationContext(app, null, request));
			out.text(msg.get("app_"+app, request.getLocale())).endA().endLi();
		}		
		
		out.endUl();

		if (!publicUser && !privateApps.isEmpty()) {
			out.startUl("oo_topbar_private");
			for (String app : privateApps) {			
				out.startLi("oo_topbar_"+app).startA(request.isApplication(app) ? "oo_topbar_selected" : null);
				out.withHref(configurationService.getApplicationContext(app, null, request));
				out.text(msg.get("app_"+app, request.getLocale())).endA().endLi();
			}
			out.endUl();			
		}
		
		
		out.startUl("oo_topbar_right");
		if (publicUser) {
			out.startLi().startVoidA("oo_topbar_login").withAttribute("data", "login").write("Log in").endA().endLi();
		} else {
			User user = request.getSession().getUser();
			InboxService inboxService = Components.getBean(InboxService.class);
			int count = inboxService.getCountSilently(user);
			out.startLi().startVoidA("oo_topbar_inbox").withAttribute("data", "inbox").text(count).endA().endLi();
			out.startLi().startVoidA("oo_topbar_user").withAttribute("data", "user");
			out.startSpan().withClass("oo_icon oo_icon_16 oo_icon_user").endSpan();
			out.write(user.getName()).endA().endLi();
		}
		out.endUl();
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();

		writer.startScopedScript();
		writer.write("new oo.TopBar({element:'").write(getClientId()).write("'});");
		writer.endScopedScript();
	}
}
