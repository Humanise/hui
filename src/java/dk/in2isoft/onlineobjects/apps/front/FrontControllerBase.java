package dk.in2isoft.onlineobjects.apps.front;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class FrontControllerBase extends ApplicationController {
	
	protected static final Blend publicScript;
	protected static final Blend publicStyle;
	
	static {

		publicScript = new Blend("front_public_script");
		publicScript.addPath("hui","js","hui.js");
		publicScript.addPath("hui","js","hui_animation.js");
		//publicScript.addPath("hui","js","hui_color.js");
		publicScript.addPath("hui","js","ui.js");
		publicScript.addPath("hui","js","Drawing.js");
		publicScript.addPath("WEB-INF","apps","front","web","animation.js");

	
		publicStyle = new Blend("front_public_style");
		publicStyle.addCoreCSS("oo_font.css");
		publicStyle.addCoreCSS("oo_icon.css");
		publicStyle.addPath("WEB-INF","apps","front","web","css","front.css");

	}

	public FrontControllerBase() {
		super("front");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
	}
	
	@Override
	public void unknownRequest(Request request) throws IOException,
			EndUserException {
		if (request.testLocalPathStart()) {
			super.unknownRequest(request);
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