package dk.in2isoft.onlineobjects.apps.reader;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import nu.xom.Document;
import opennlp.tools.util.Span;

import org.apache.commons.lang.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.commons.lang.StringSearcher;
import dk.in2isoft.commons.lang.StringSearcher.Result;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.xml.DecoratedDocument;
import dk.in2isoft.onlineobjects.apps.reader.perspective.ArticlePerspective;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordCategoryPerspectiveQuery;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.networking.NetworkResponse;
import dk.in2isoft.onlineobjects.modules.networking.NetworkService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.PileService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.services.StorageService;

public class ReaderArticleBuilder {
	
	private static final Logger log = LoggerFactory.getLogger(ReaderArticleBuilder.class);
	
	private ModelService modelService;
	private PileService pileService;
	private NetworkService networkService;
	private StorageService storageService;
	private LanguageService languageService;
	private SemanticService semanticService;

	public ArticlePerspective getArticlePerspective(Long id, UserSession session)
			throws ModelException, IllegalRequestException, SecurityException,
			ExplodingClusterFuckException {
		StopWatch watch = new StopWatch();
		watch.start();
		InternetAddress address = modelService.get(InternetAddress.class, id, session);
		Code.checkNotNull(address, "Not found");

		HTMLDocument document = getHTMLDocument(address, session);

		ArticlePerspective article = new ArticlePerspective();

		article.setUrl(address.getAddress());

		Pile inbox = pileService.getOrCreatePileByRelation(session.getUser(), Relation.KIND_SYSTEM_USER_INBOX);
		Pile favorites = pileService.getOrCreatePileByRelation(session.getUser(), Relation.KIND_SYSTEM_USER_FAVORITES);

		List<Pile> piles = modelService.getParents(address, Pile.class, session);
		for (Pile pile : piles) {
			if (pile.getId() == inbox.getId()) {
				article.setInbox(true);
			} else if (pile.getId() == favorites.getId()) {
				article.setFavorite(true);
			}
		}

		List<Statement> quotes = modelService.getChildren(address, Relation.KIND_STRUCTURE_CONTAINS, Statement.class, session);
		List<Pair<Long, String>> quoteList = Lists.newArrayList();
		for (Statement htmlPart : quotes) {
			quoteList.add(Pair.of(htmlPart.getId(), htmlPart.getText()));
		}
		article.setQuotes(quoteList);

		article.setHeader(buildHeader(address));
		article.setInfo(buildInfo(document, address, session));
		article.setId(address.getId());
		
		watch.split();
		log.trace("Base: "+watch.getSplitTime());
		if (document != null) {
			article.setTitle(document.getTitle());
			buildRendering(document, address, quotes, article, watch);
		} else {
			article.setTitle(address.getName());
		}
		
		watch.stop();
		log.trace("Total: "+watch.getTime());
		return article;
	}

	private HTMLDocument getHTMLDocument(InternetAddress address, Privileged privileged) throws SecurityException, ModelException {

		File folder = storageService.getItemFolder(address);
		File original = new File(folder, "original");
		String encoding = address.getPropertyValue(Property.KEY_INTERNETADDRESS_ENCODING);
		if (Strings.isBlank(encoding)) {
			encoding = Strings.UTF8;
		}
		if (!original.exists()) {
			NetworkResponse response = networkService.getSilently(address.getAddress());
			if (response != null && response.isSuccess()) {
				File temp = response.getFile();
				if (!Files.copy(temp, original)) {
					response.cleanUp();
					return null;
				}
				address.overrideFirstProperty(Property.KEY_INTERNETADDRESS_ENCODING, encoding);
				modelService.updateItem(address, privileged);
			}
		}
		return new HTMLDocument(Files.readString(original, encoding));
	}

	private String buildHeader(InternetAddress address) {
		HTMLWriter writer = new HTMLWriter();
		writer.startH1().text(address.getName()).endH1();
		writer.startP().withClass("link").startA().withHref(address.getAddress()).text(address.getAddress()).endA().endP();
		return writer.toString();
	}

	private String buildInfo(HTMLDocument document, InternetAddress address, UserSession session) throws ModelException {
		HTMLWriter writer = new HTMLWriter();
		writer.startH2().withClass("info_header").text("Authors").endH2();
		writer.startP().withClass("tags info_authors");
		writer.text("No author");
		writer.endP();
		writer.startH2().withClass("info_header").text("Tags").endH2();
		writer.startP().withClass("tags info_tags");
		{
			List<String> tags = address.getPropertyValues(Property.KEY_COMMON_TAG);
			if (!tags.isEmpty()) {
				for (String string : tags) {
					writer.startVoidA().withClass("tag info_tags_item info_tag").withData(string).text(string).endA().text(" ");
				}
			}
		}
		{
			User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
			List<Word> words = modelService.getChildren(address, Word.class, admin);
			for (Word word : words) {
				if (word == null || address == null) {
					continue;
				}
				writer.startVoidA().withData(word.getId()).withClass("info_tags_item info_word word");
				writer.text(word.getText()).endA().text(" ");
			}

		}
		writer.startA().withClass("add info_tags_item info_tags_add").text("Add word").endA();
		writer.endP();

		return writer.toString();
	}

	private void buildRendering(HTMLDocument document, InternetAddress address, List<Statement> statements, ArticlePerspective article, StopWatch watch) throws ModelException, ExplodingClusterFuckException {

		{
			String extractedMarkup = document.getExtractedMarkup();
			String readableMarkup = document.getReadableMarkup();
			String string = readableMarkup.length() > extractedMarkup.length() ? readableMarkup : extractedMarkup;
			article.setFormatted(annotate(statements, string, watch));
		}
		{
			String string = "<body>" + document.getExtractedContents().replaceAll("\n", "<br/><br/>") + "</body>";
			article.setText(annotate(statements, string, watch));
		}
	}

	private String annotate(List<Statement> statements, String string, StopWatch watch) throws ModelException, ExplodingClusterFuckException {
		Document xomDocument = new HTMLDocument(string).getXOMDocument();
		watch.split();
		log.trace("Parsed HTML: "+watch.getSplitTime());
		
		DecoratedDocument decorated = new DecoratedDocument(xomDocument);
		String text = decorated.getText();
		watch.split();
		log.trace("Decorated: "+watch.getSplitTime());
		

		Locale locale = languageService.getLocale(text);
		watch.split();
		log.trace("Get locale: "+watch.getSplitTime());
		
		if (!false) {
			annotatePeople(watch, decorated, text, locale);
		}

		StringSearcher searcher = new StringSearcher();
		for (Statement statement : statements) {
			List<Result> found = searcher.search(statement.getText(),text);
			for (Result result : found) {
				Map<String, Object> attributes = new HashMap<>();
				attributes.put("data-id", statement.getId());
				attributes.put("class", "quote");
				decorated.decorate(result.getFrom(), result.getTo(), "mark", attributes);
			}
			if (found.isEmpty()) {
				log.warn("Statement not found: " + statement.getText());
				log.warn("Text: " + text);
			}
		}
		decorated.build();
		return decorated.getDocument().toXML();
	}

	private void annotatePeople(StopWatch watch, DecoratedDocument decorated, String text, Locale locale) throws ExplodingClusterFuckException, ModelException {
		List<Span> nounSpans = Lists.newArrayList();
		
		List<String> nouns = Lists.newArrayList();
		
		Span[] sentences = semanticService.getSentencePositions(text, locale);
		watch.split();
		log.trace("Sentences: "+watch.getSplitTime());
		for (Span sentence : sentences) {
			//decorated.decorate(sentence.getStart(), sentence.getEnd(), "mark", getClassMap("sentence") );

			String sentenceText = sentence.getCoveredText(text).toString();
			Span[] sentenceTokenPositions = semanticService.getTokenSpans(sentenceText, locale);
			String[] sentenceTokens = semanticService.spansToStrings(sentenceTokenPositions, sentenceText);
			String[] partOfSpeach = semanticService.getPartOfSpeach(sentenceTokens, locale);
			for (int i = 0; i < sentenceTokenPositions.length; i++) {
				String token = sentenceTokens[i];
				if (!Character.isUpperCase(token.charAt(0))) {
					continue;
				}
				if (!partOfSpeach[i].startsWith("N")) {
					continue;
				}
				boolean prev = i>0 && partOfSpeach[i-1].startsWith("N") && Character.isUpperCase(sentenceTokens[i-1].charAt(0));
				boolean next = i<sentenceTokenPositions.length-1 && partOfSpeach[i+1].startsWith("N") && Character.isUpperCase(sentenceTokens[i+1].charAt(0));
				if (!(prev || next)) {
					continue;
				}
				nouns.add(token);
				Span spn = new Span(sentenceTokenPositions[i].getStart()+sentence.getStart(),sentenceTokenPositions[i].getEnd()+sentence.getStart(),token);
				nounSpans.add(spn);
			}
		}
		watch.split();
		log.trace("Part of speech: "+watch.getSplitTime());
		List<WordListPerspective> names = findNames(nouns);

		watch.split();
		log.trace("Find names: "+watch.getSplitTime());
		
		for (Span span : nounSpans) {
			String cls = "noun";
			if (isPerson(span.getType(),names)) {
				cls = "person";
			}
			decorated.decorate(span.getStart(), span.getEnd(), "mark", getClassMap(cls) );
		}
	}

	private List<WordListPerspective> findNames(List<String> words) throws ModelException, ExplodingClusterFuckException {
		if (Code.isEmpty(words)) {
			
		}
		WordCategoryPerspectiveQuery query = new WordCategoryPerspectiveQuery().withWords(words);
		query.withCategories(LexicalCategory.CODE_PROPRIUM_FIRST,LexicalCategory.CODE_PROPRIUM_MIDDLE, LexicalCategory.CODE_PROPRIUM_LAST);
		return modelService.search(query).getList();
	}

	private boolean isPerson(String token, List<WordListPerspective> words) {
		for (WordListPerspective word : words) {
			if (word.getText().equalsIgnoreCase(token)) {
				return true;
			}
		}
		return false;
	}

	private Map<String, Object> getClassMap(Object cls) {
		Map<String, Object> attributes = new HashMap<>();
		attributes.put("class", cls );
		return attributes;
	}
	
	// Wiring...
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setNetworkService(NetworkService networkService) {
		this.networkService = networkService;
	}
	
	public void setPileService(PileService pileService) {
		this.pileService = pileService;
	}
	
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
	
	public void setStorageService(StorageService storageService) {
		this.storageService = storageService;
	}
}
