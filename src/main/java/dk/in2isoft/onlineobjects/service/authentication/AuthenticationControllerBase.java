package dk.in2isoft.onlineobjects.service.authentication;

import dk.in2isoft.onlineobjects.apps.community.services.MemberService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.services.PasswordRecoveryService;

public abstract class AuthenticationControllerBase extends ServiceController {

	protected SecurityService securityService;
	protected MemberService memberService;
	protected PasswordRecoveryService passwordRecoveryService;

	
	public AuthenticationControllerBase() {
		super("authentication");
		addJsfMatcher("/", "login.xhtml");
	}
	
	// Wiring...

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
	
	public void setPasswordRecoveryService(PasswordRecoveryService passwordRecoveryService) {
		this.passwordRecoveryService = passwordRecoveryService;
	}
}