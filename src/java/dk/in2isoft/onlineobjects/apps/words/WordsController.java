package dk.in2isoft.onlineobjects.apps.words;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public class WordsController extends ApplicationController {

	public WordsController() {
		super("words");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/word/<word>.html", "word.xhtml");
		addJsfMatcher("/<language>/import/<folder>", "import.xhtml");
		addJsfMatcher("/<language>/index/<word>", "index.xhtml");
		addJsfMatcher("/<language>/index/<word>/<integer>", "index.xhtml");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		super.unknownRequest(request);
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
