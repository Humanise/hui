package dk.in2isoft.onlineobjects.apps.account;

import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class AccountControllerBase extends ApplicationController {

	public AccountControllerBase() {
		super("account");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
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


}