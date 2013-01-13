package dk.in2isoft.onlineobjects.apps.words;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.services.FeedService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Request;

public class WordsControllerBase extends ApplicationController {

	protected ImportService importService;
	protected WordsModelService wordsModelService;
	protected FeedService feedService;

	public WordsControllerBase() {
		super("words");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/search", "search.xhtml");
		addJsfMatcher("/<language>/search/<integer>", "search.xhtml");
		addJsfMatcher("/<language>/word/<no-dot>.html", "word.xhtml");
		addJsfMatcher("/<language>/import/<folder>", "import.xhtml");
		addJsfMatcher("/<language>/index/<folder>", "index.xhtml");
		addJsfMatcher("/<language>/index/<folder>/<integer>", "index.xhtml");
	}

	public WordsControllerBase(String name) {
		super(name);
	}

	@Override
	public String getLanguage(Request request) {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			return path[0];
		}
		return super.getLanguage(request);
	}

	public void setImportService(ImportService importService) {
		this.importService = importService;
	}

	public void setWordsModelService(WordsModelService wordsModelService) {
		this.wordsModelService = wordsModelService;
	}
	
	public void setFeedService(FeedService feedService) {
		this.feedService = feedService;
	}

}