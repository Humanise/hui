package dk.in2isoft.onlineobjects.apps.api;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.service.language.TextAnalysis;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.ui.Request;


public class APIController extends APIControllerBase {

	protected static final Blend publicScript;
	
	static {

		publicScript = new Blend("front_public_script");
		publicScript.addPath("hui","js","hui.js");
		publicScript.addPath("hui","js","hui_animation.js");
		//publicScript.addPath("hui","js","hui_color.js");
		publicScript.addPath("hui","js","ui.js");
		publicScript.addPath("hui","js","Drawing.js");
		publicScript.addPath("WEB-INF","apps","front","web","animation.js");
	}

	@Path(start={"v1.0","language","analyse"})
	public TextAnalysis script(Request request) throws IOException, EndUserException {
		String text = request.getString("text");
		return languageService.analyse(text);
	}
}
