package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value=TopBarComponent.FAMILY)
public class TopBarComponent <T> extends AbstractComponent {


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
		ConfigurationService configurationService = ComponentUtil.getBean(ConfigurationService.class);
		boolean developmentMode = configurationService.isDevelopmentMode();
		Request request = Request.get(context);
		out.startDiv("oo_topbar oo_faded").withId(getClientId());
		out.startStrong().write("Online").startSpan().write("Objects").endSpan().endStrong();
		out.startUl("oo_topbar_left");
		//out.startLi("oo_topbar_people").startVoidA(null).write("People").endA().endLi();
		//out.startLi("oo_topbar_images").startVoidA(null).write("Images").endA().endLi();
		out.startLi("oo_topbar_people").startA(request.isApplication("community") ? "oo_topbar_selected" : null);
		if (developmentMode) {
			out.withHref(request.getBaseContext()+"/");
		} else {
			out.withHref("http://www.onlineme.dk/");
		}
		out.write("Community").endA().endLi();
		
		out.startLi("oo_topbar_words").startA(request.isApplication("words") ? "oo_topbar_selected" : null);
		if (developmentMode) {
			out.withHref(request.getBaseContext()+"/app/words/"+getLocale().getLanguage()+"/");
		} else {
			out.withHref("http://words.onlineobjects.com/"+getLocale().getLanguage()+"/");
		}
		out.write("Words").endA().endLi();
		
		out.startLi("oo_topbar_photos").startA(request.isApplication("photos") ? "oo_topbar_selected" : null);
		if (developmentMode) {
			out.withHref(request.getBaseContext()+"/app/photos/"+getLocale().getLanguage()+"/");
		} else {
			out.withHref("http://photos.onlineobjects.com/"+getLocale().getLanguage()+"/");
		}
		out.write("Photos").endA().endLi();
		
		out.endUl();
		out.startUl("oo_topbar_right");
		
		if (request.isUser("public")) {
			out.startLi().startVoidA("oo_topbar_login").withAttribute("data", "login").write("Log in").endA().endLi();
		} else {
			User user = request.getSession().getUser();
			out.startLi().startA();
			if (developmentMode) {
				out.withHref(request.getBaseContext()+"/"+user.getUsername()+"/private/images.gui");
			} else {
				out.withHref("http://www.onlineme.dk/"+user.getUsername()+"/private/images.gui");
			}
			out.write("Tools").endA().endLi();
			out.startLi().startVoidA("oo_topbar_user").withAttribute("data", "user").write(user.getName()).endA().endLi();
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
