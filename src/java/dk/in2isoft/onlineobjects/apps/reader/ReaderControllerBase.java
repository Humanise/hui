package dk.in2isoft.onlineobjects.apps.reader;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.reader.index.ReaderIndexer;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.index.IndexService;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.modules.networking.NetworkService;
import dk.in2isoft.onlineobjects.services.FeedService;
import dk.in2isoft.onlineobjects.services.PileService;
import dk.in2isoft.onlineobjects.services.StorageService;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class ReaderControllerBase extends ApplicationController {
	
	protected static final Blend publicScript;
	protected static final Blend publicStyle;
	
	protected NetworkService networkService;
	protected HTMLService htmlService;
	protected PileService pileService;
	protected FeedService feedService;
	protected StorageService storageService;
	protected IndexService indexService;
	protected ReaderIndexer readerIndexer;
	
	static {

		publicScript = new Blend("reader_public_script");
		publicScript.addPath("hui","js","hui.js");
		publicScript.addPath("hui","js","hui_animation.js");
		publicScript.addPath("hui","js","hui_require.js");
		publicScript.addPath("hui","js","ui.js");
		publicScript.addPath("hui","js","Button.js");
		publicScript.addPath("hui","js","BoundPanel.js");
		publicScript.addPath("hui","js","TextField.js");
		publicScript.addPath("hui","js","Formula.js");
		publicScript.addPath("hui","js","List.js");
		publicScript.addPath("hui","js","Source.js");
		publicScript.addPath("hui","js","SearchField.js");
		publicScript.addPath("hui","js","Overflow.js");
		publicScript.addPath("hui","js","DropDown.js");
		publicScript.addPath("hui","js","Pages.js");
		publicScript.addPath("hui","js","Fragment.js");
		publicScript.addPath("hui","js","Diagram.js");
		publicScript.addPath("hui","js","Drawing.js");
		publicScript.addPath("hui","js","Window.js");
		publicScript.addPath("hui","js","Overlay.js");
		publicScript.addPath("hui","js","hui_color.js");
		publicScript.addPath("WEB-INF","core","web","js","onlineobjects.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_topbar.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_selection.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_inspector.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_wordfinder.js");
		publicScript.addPath("WEB-INF","apps","reader","web","js","reader.js");

	
		publicStyle = new Blend("reader_public_style");
		publicStyle.addBasicCSS();
		publicStyle.addCoreCSS("oo_font.css");
		publicStyle.addCoreCSS("oo_icon.css");
		publicStyle.addCoreCSS("oo_selection.css");
		publicStyle.addHUICSS("icon.css");
		publicStyle.addHUICSS("list.css");
		publicStyle.addHUICSS("searchfield.css");
		publicStyle.addHUICSS("overflow.css");
		publicStyle.addHUICSS("pages.css");
		publicStyle.addHUICSS("window.css");
		publicStyle.addHUICSS("dropdown.css");
		publicStyle.addHUICSS("diagram.css");
		publicStyle.addHUICSS("bar.css");
		publicStyle.addHUICSS("overlay.css");
		publicStyle.addPath("WEB-INF","apps","reader","web","css","reader.css");
		publicStyle.addPath("WEB-INF","apps","reader","web","css","reader_viewer.css");

	}

	public ReaderControllerBase() {
		super("reader");
		addJsfMatcher("/", "reader.xhtml");
		addJsfMatcher("/<language>", "reader.xhtml");
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
	public String getLanguage(Request request) {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			return path[0];
		}
		return super.getLanguage(request);
	}
	
	@Override
	public boolean isAllowed(Request request) {
		return !request.isUser(SecurityService.PUBLIC_USERNAME);
	}
	
	// Wiring...

	public void setNetworkService(NetworkService networkService) {
		this.networkService = networkService;
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
	
	public void setPileService(PileService pileService) {
		this.pileService = pileService;
	}
	
	public void setFeedService(FeedService feedService) {
		this.feedService = feedService;
	}
	
	public void setStorageService(StorageService storageService) {
		this.storageService = storageService;
	}
	
	public void setIndexService(IndexService indexService) {
		this.indexService = indexService;
	}
	
	public void setReaderIndexer(ReaderIndexer readerIndexer) {
		this.readerIndexer = readerIndexer;
	}
}