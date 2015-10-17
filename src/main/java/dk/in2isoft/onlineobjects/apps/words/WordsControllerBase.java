package dk.in2isoft.onlineobjects.apps.words;

import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.FeedService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.ui.Request;

public class WordsControllerBase extends ApplicationController {

	protected ImportService importService;
	protected WordsModelService wordsModelService;
	protected FeedService feedService;
	protected HTMLService htmlService;
	protected LanguageService languageService;

	public WordsControllerBase() {
		super("words");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/statistics", "statistics.xhtml");
		addJsfMatcher("/<language>/search", "search.xhtml");
		addJsfMatcher("/<language>/about", "about.xhtml");
		addJsfMatcher("/<language>/search/<integer>", "search.xhtml");
		addJsfMatcher("/<language>/word/<any>", "word.xhtml");
		addJsfMatcher("/<language>/import/<folder>", "import.xhtml");
		addJsfMatcher("/<language>/importlist/<folder>", "importList.xhtml");
		addJsfMatcher("/<language>/index/<folder>", "index.xhtml");
		addJsfMatcher("/<language>/index/<folder>/<integer>", "index.xhtml");
		addJsfMatcher("/<language>/enrich", "enrich.xhtml");
	}
	
	public List<Locale> getLocales() {
		return Lists.newArrayList(new Locale("en"),new Locale("da"));
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
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}

}