package dk.in2isoft.onlineobjects.apps.words;

import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.FeedService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.ui.Request;

public class WordsControllerBase extends ApplicationController {

	protected ImportService importService;
	protected WordsModelService wordsModelService;
	protected FeedService feedService;
	protected HTMLService htmlService;

	protected static final Blend publicStyle;
	protected static final Blend publicScript;
	static {
		publicStyle = new Blend("words_public_style");
		//publicStyle.addPath("WEB-INF","core","web","fonts","lora","stylesheet.css");
		publicStyle.addBasicCSS();
		publicStyle.addPath("hui","css","searchfield.css");
		publicStyle.addPath("hui","css","panel.css");
		publicStyle.addPath("hui","css","boundpanel.css");
		publicStyle.addPath("hui","css","window.css");
		publicStyle.addPath("hui","css","list.css");
		publicStyle.addPath("hui","css","dropdown.css");
		publicStyle.addPath("hui","ext","diagram.css");
		publicStyle.addPath("hui","css","box.css");
		publicStyle.addPath("hui","css","bar.css");
		publicStyle.addPath("hui","css","overlay.css");
		publicStyle.addPath("hui","ext","pages.css");
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words.css");
		publicStyle.addPath("WEB-INF","apps","words","web","style","css","words_sidebar.css");		
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
		publicScript.addPath("hui","ext","Diagram.js");
		publicScript.addPath("hui","ext","Pages.js");
		publicScript.addPath("hui","js","Overlay.js");
		publicScript.addPath("hui","js","DragDrop.js");
		publicScript.addPath("hui","js","Drawing.js");
		publicScript.addPath("hui","js","Window.js");
		publicScript.addPath("hui","js","Box.js");
		publicScript.addPath("WEB-INF","core","web","js","onlineobjects.js");
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
		addJsfMatcher("/<language>/index/<folder>", "index.xhtml");
		addJsfMatcher("/<language>/index/<folder>/<integer>", "index.xhtml");
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

}