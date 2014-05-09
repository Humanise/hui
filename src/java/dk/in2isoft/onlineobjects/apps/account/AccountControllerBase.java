package dk.in2isoft.onlineobjects.apps.account;

import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class AccountControllerBase extends ApplicationController {

	protected SecurityService securityService;
	
	protected static final Blend publicScript;
	protected static final Blend publicStyle;

	static {

		publicScript = new Blend("reader_public_script");
		publicScript.addPath("hui","js","hui.js");
		publicScript.addPath("hui","js","hui_animation.js");
		publicScript.addPath("hui","js","ui.js");
		publicScript.addPath("hui","js","Button.js");
		publicScript.addPath("hui","js","BoundPanel.js");
		publicScript.addPath("hui","js","TextField.js");
		publicScript.addPath("hui","js","Formula.js");
		publicScript.addPath("hui","js","List.js");
		publicScript.addPath("hui","js","Box.js");
		publicScript.addPath("hui","js","Source.js");
		publicScript.addPath("hui","js","SearchField.js");
		publicScript.addPath("hui","js","Overflow.js");
		publicScript.addPath("hui","js","DropDown.js");
		publicScript.addPath("hui","js","Pages.js");
		publicScript.addPath("hui","js","Fragment.js");
		publicScript.addPath("hui","js","Window.js");
		publicScript.addPath("hui","js","Overlay.js");
		publicScript.addPath("hui","js","hui_color.js");
		publicScript.addPath("WEB-INF","core","web","js","onlineobjects.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_topbar.js");
		publicScript.addPath("WEB-INF","apps","account","web","js","account.js");


		publicStyle = new Blend("reader_public_style");
		publicStyle.addBasicCSS();
		publicStyle.addCoreCSS("oo_font.css");
		publicStyle.addCoreCSS("oo_icon.css");
		publicStyle.addHUICSS("icon.css");
		publicStyle.addHUICSS("list.css");
		publicStyle.addHUICSS("box.css");
		publicStyle.addHUICSS("searchfield.css");
		publicStyle.addHUICSS("overflow.css");
		publicStyle.addHUICSS("pages.css");
		publicStyle.addHUICSS("window.css");
		publicStyle.addHUICSS("dropdown.css");
		publicStyle.addHUICSS("bar.css");
		publicStyle.addHUICSS("overlay.css");
		publicStyle.addPath("WEB-INF","apps","account","web","css","account.css");

	}
	public AccountControllerBase() {
		super("account");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/password", "password.xhtml");
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
	
	// Wiring...
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

}