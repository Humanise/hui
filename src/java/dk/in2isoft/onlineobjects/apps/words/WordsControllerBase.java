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

	protected static final Blend publicStyle;
	protected static final Blend publicScript;
	static {
		publicStyle = new Blend("words_public_style");
		publicStyle.addBasicCSS();
		publicStyle.addHUICSS("searchfield.css");
		publicStyle.addHUICSS("panel.css");
		publicStyle.addHUICSS("overflow.css");
		publicStyle.addHUICSS("boundpanel.css");
		publicStyle.addHUICSS("window.css");
		publicStyle.addHUICSS("list.css");
		publicStyle.addHUICSS("dropdown.css");
		publicStyle.addHUICSS("diagram.css");
		publicStyle.addHUICSS("box.css");
		publicStyle.addHUICSS("bar.css");
		publicStyle.addHUICSS("overlay.css");
		publicStyle.addHUICSS("pages.css");
		publicStyle.addHUICSS("upload.css");
		publicStyle.addHUICSS("progressbar.css");
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words.css");
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_sidebar.css");
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_front.css");
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_search.css");		
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_word.css");
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_statistics.css");		
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_layout.css");		
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_paging.css");		
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_list.css");		
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_import.css");		
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_menu.css");		
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_about.css");		

		publicScript = new Blend("words_public_script");
		publicScript.addPath("hui","js","hui.js");
		publicScript.addPath("hui","js","hui_require.js");
		publicScript.addPath("hui","js","hui_animation.js");
		publicScript.addPath("hui","js","hui_color.js");
		publicScript.addPath("hui","js","ui.js");
		publicScript.addPath("hui","js","SearchField.js");
		publicScript.addPath("hui","js","Button.js");
		publicScript.addPath("hui","js","BoundPanel.js");
		publicScript.addPath("hui","js","List.js");
		publicScript.addPath("hui","js","Overflow.js");
		publicScript.addPath("hui","js","Source.js");
		publicScript.addPath("hui","js","Formula.js");
		publicScript.addPath("hui","js","TextField.js");
		publicScript.addPath("hui","js","DropDown.js");
		publicScript.addPath("hui","js","Diagram.js");
		publicScript.addPath("hui","js","Pages.js");
		publicScript.addPath("hui","js","Overlay.js");
		publicScript.addPath("hui","js","DragDrop.js");
		publicScript.addPath("hui","js","Drawing.js");
		publicScript.addPath("hui","js","Window.js");
		publicScript.addPath("hui","js","Box.js");
		publicScript.addPath("hui","js","Fragment.js");
		publicScript.addPath("hui","js","Upload.js");
		publicScript.addPath("hui","js","ProgressBar.js");
		publicScript.addPath("WEB-INF","core","web","js","onlineobjects.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_topbar.js");
		publicScript.addPath("WEB-INF","apps","words","web","style","js","words.js");
	}

	public WordsControllerBase() {
		super("words");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/statistics", "statistics.xhtml");
		addJsfMatcher("/<language>/search", "search.xhtml");
		addJsfMatcher("/<language>/about", "about.xhtml");
		addJsfMatcher("/<language>/search/<integer>", "search.xhtml");
		addJsfMatcher("/<language>/word/<no-dot>.html", "word.xhtml");
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