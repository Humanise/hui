package dk.in2isoft.onlineobjects.apps.front;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class FrontControllerBase extends ApplicationController {

	public FrontControllerBase() {
		super("front");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
	}
	
	@Override
	public void unknownRequest(Request request) throws IOException,
			EndUserException {
		if (request.testLocalPathStart()) {
			
		} else {
			super.unknownRequest(request);
		}
	}

	public List<Locale> getLocales() {
		return Lists.newArrayList(new Locale("en"),new Locale("da"));
	}
	
	@Override
	public String getMountPoint() {
		return "www";
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