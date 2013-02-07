package dk.in2isoft.onlineobjects.service.authentication;

import dk.in2isoft.onlineobjects.apps.community.services.MemberService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.service.ServiceController;

public abstract class AuthenticationControllerBase extends ServiceController {

	protected SecurityService securityService;
	protected MemberService memberService;

	public AuthenticationControllerBase() {
		super("authentication");
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
}