package dk.in2isoft.onlineobjects.service.authentication;

import dk.in2isoft.onlineobjects.apps.community.services.MemberService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.Blend;

public abstract class AuthenticationControllerBase extends ServiceController {

	protected SecurityService securityService;
	protected MemberService memberService;

	protected static final Blend publicScript;
	protected static final Blend publicStyle;
	
	static {

		publicScript = new Blend("authentication_public_script");
		publicScript.addPath("hui","js","hui.js");
		publicScript.addPath("hui","js","hui_animation.js");
		publicScript.addPath("hui","js","ui.js");
		publicScript.addPath("hui","js","Formula.js");
		publicScript.addPath("hui","js","TextField.js");
		publicScript.addPath("hui","js","Button.js");
		publicScript.addPath("WEB-INF","services","authentication","web","js","login.js");

	
		publicStyle = new Blend("authentication_public_style");
		publicStyle.addCoreCSS("oo_body.css");
		publicStyle.addCoreCSS("oo_link.css");
		publicStyle.addCoreCSS("oo_header.css");
		publicStyle.addCoreCSS("oo_font.css");
		publicStyle.addCoreCSS("oo_icon.css");
		publicStyle.addHUICSS("formula.css");
		publicStyle.addHUICSS("button.css");
		publicStyle.addPath("WEB-INF","services","authentication","web","css","style.css");
	}

	
	public AuthenticationControllerBase() {
		super("authentication");
		addJsfMatcher("/", "login.xhtml");
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
}