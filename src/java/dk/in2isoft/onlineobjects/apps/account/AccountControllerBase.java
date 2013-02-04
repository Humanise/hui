package dk.in2isoft.onlineobjects.apps.account;

import dk.in2isoft.onlineobjects.apps.ApplicationController;

public abstract class AccountControllerBase extends ApplicationController {

	public AccountControllerBase() {
		super("account");
		addJsfMatcher("/", "front.xhtml");
	}


}