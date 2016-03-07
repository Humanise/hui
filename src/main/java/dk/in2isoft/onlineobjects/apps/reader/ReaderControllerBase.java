package dk.in2isoft.onlineobjects.apps.reader;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.reader.index.ReaderIndexer;
import dk.in2isoft.onlineobjects.apps.reader.perspective.HypothesisViewPerspectiveBuilder;
import dk.in2isoft.onlineobjects.apps.reader.perspective.InternetAddressViewPerspectiveBuilder;
import dk.in2isoft.onlineobjects.apps.reader.perspective.QuestionViewPerspectiveBuilder;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.index.IndexService;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.modules.networking.NetworkService;
import dk.in2isoft.onlineobjects.services.FeedService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.PersonService;
import dk.in2isoft.onlineobjects.services.PileService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.services.StorageService;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class ReaderControllerBase extends ApplicationController {
	
	protected NetworkService networkService;
	protected HTMLService htmlService;
	protected PileService pileService;
	protected FeedService feedService;
	protected StorageService storageService;
	protected IndexService indexService;
	protected ReaderIndexer readerIndexer;
	protected LanguageService languageService;
	protected SemanticService semanticService;
	protected WordService wordService;
	protected InternetAddressViewPerspectiveBuilder internetAddressViewPerspectiveBuilder;
	protected ReaderSearcher readerSearcher;
	protected QuestionViewPerspectiveBuilder questionViewPerspectiveBuilder;
	protected HypothesisViewPerspectiveBuilder hypothesisViewPerspectiveBuilder;
	protected PersonService personService;
	protected ReaderModelService readerModelService;

	public ReaderControllerBase() {
		super("reader");
		addJsfMatcher("/", "reader.xhtml");
		addJsfMatcher("/<language>", "reader.xhtml");
		addJsfMatcher("/<language>/analyze", "analyze.xhtml");
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
	
	@Override
	public boolean askForUserChange(Request request) {
		return true;
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
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
	
	public void setWordService(WordService wordService) {
		this.wordService = wordService;
	}
	
	public void setInternetAddressViewPerspectiveBuilder(InternetAddressViewPerspectiveBuilder articleBuilder) {
		this.internetAddressViewPerspectiveBuilder = articleBuilder;
	}
	
	public void setReaderSearcher(ReaderSearcher readerSearcher) {
		this.readerSearcher = readerSearcher;
	}
	
	public void setQuestionViewPerspectiveBuilder(QuestionViewPerspectiveBuilder questionViewPerspectiveBuilder) {
		this.questionViewPerspectiveBuilder = questionViewPerspectiveBuilder;
	}
	
	public void setHypothesisViewPerspectiveBuilder(HypothesisViewPerspectiveBuilder hypothesisViewPerspectiveBuilder) {
		this.hypothesisViewPerspectiveBuilder = hypothesisViewPerspectiveBuilder;
	}
	
	public void setPersonService(PersonService personService) {
		this.personService = personService;
	}
	
	public void setReaderModelService(ReaderModelService readerModelService) {
		this.readerModelService = readerModelService;
	}
}