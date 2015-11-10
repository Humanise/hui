package dk.in2isoft.onlineobjects.apps.reader;

import java.io.File;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.Nodes;
import nu.xom.XPathContext;
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
import dk.in2isoft.commons.xml.DocumentCleaner;
import dk.in2isoft.commons.xml.DocumentToText;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.apps.reader.perspective.InternetAddressViewPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.StatementPerspective;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.information.ContentExtractor;
import dk.in2isoft.onlineobjects.modules.information.SimpleContentExtractor;
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
	private Map<String,ContentExtractor> contentExtractors;

	public InternetAddressViewPerspective getArticlePerspective(Long id, String algorithm, boolean highlight, UserSession session) throws ModelException, IllegalRequestException, SecurityException, ExplodingClusterFuckException {
		StopWatch watch = new StopWatch();
		watch.start();
		InternetAddress address = modelService.get(InternetAddress.class, id, session);
		if (address == null) {
			throw new IllegalRequestException("Not found");
		}

		HTMLDocument document = getHTMLDocument(address, session);
		
		ArticleData data = buildData(address);

		InternetAddressViewPerspective article = new InternetAddressViewPerspective();

		article.setTitle(address.getName());
		article.setUrl(address.getAddress());
		article.setAuthors(getAuthors(address, session));

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

		loadStatements(address, article, session);

		article.setHeader(buildHeader(address));
		article.setInfo(buildInfo(document, data, session));
		article.setId(address.getId());

		watch.split();
		log.trace("Base: " + watch.getSplitTime());
		if (document != null) {
			buildRendering(document, data, article, algorithm, highlight, watch);
		}

		watch.stop();
		log.trace("Total: " + watch.getTime());
		return article;
	}

	private List<ItemData> getAuthors(Entity address, UserSession session) {
		Query<Person> query = Query.of(Person.class).from(address,Relation.KIND_COMMON_AUTHOR).withPrivileged(session);
		List<Person> people = modelService.list(query);
		List<ItemData> authors = people.stream().map((Person p) -> {
			ItemData option = new ItemData();
			option.setValue(p.getId());
			option.setText(p.getFullName());
			return option;
		}).collect(Collectors.toList());
		return authors;
	}

	private void loadStatements(InternetAddress address, InternetAddressViewPerspective article, UserSession session) throws ModelException {
		List<Statement> statements = modelService.getChildren(address, Relation.KIND_STRUCTURE_CONTAINS, Statement.class, session);
		List<StatementPerspective> quoteList = Lists.newArrayList();
		for (Statement statement : statements) {
			StatementPerspective statementPerspective = new StatementPerspective();
			statementPerspective.setText(statement.getText());
			statementPerspective.setId(statement.getId());
			statementPerspective.setAuthors(getAuthors(statement, session));
			quoteList.add(statementPerspective);
		}
		article.setQuotes(quoteList);
	}
	
	private ArticleData buildData(InternetAddress address) throws ModelException {
		ArticleData data = new ArticleData();
		User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
		data.address = address;
		data.keywords = modelService.getChildren(address, Word.class, admin);
		return data;
	}

	private HTMLDocument getHTMLDocument(InternetAddress address, Privileged privileged) throws SecurityException, ModelException {

		File folder = storageService.getItemFolder(address);
		File original = new File(folder, "original");
		String encoding = address.getPropertyValue(Property.KEY_INTERNETADDRESS_ENCODING);
		if (!original.exists()) {
			NetworkResponse response = networkService.getSilently(address.getAddress());
			if (response != null && response.isSuccess()) {
				File temp = response.getFile();
				if (!Files.copy(temp, original)) {
					response.cleanUp();
					return null;
				}
				if (response.getEncoding()!=null) {
					encoding = response.getEncoding();
				}
				address.overrideFirstProperty(Property.KEY_INTERNETADDRESS_ENCODING, encoding);
				modelService.updateItem(address, privileged);
			}
		}
		if (Strings.isBlank(encoding)) {
			encoding = Strings.UTF8;
		}
		return new HTMLDocument(Files.readString(original, encoding));
	}

	private String buildHeader(InternetAddress address) {
		HTMLWriter writer = new HTMLWriter();
		writer.startH1().text(address.getName()).endH1();
		writer.startP().withClass("link").startA().withTitle(address.getAddress()).withHref(address.getAddress()).text(Strings.simplifyURL(address.getAddress())).endA().endP();
		return writer.toString();
	}

	private String buildInfo(HTMLDocument document, ArticleData data, UserSession session) throws ModelException {
		HTMLWriter writer = new HTMLWriter();
		writer.startH2().withClass("info_header").text("Tags").endH2();
		writer.startP().withClass("tags info_tags");

		List<String> tags = data.address.getPropertyValues(Property.KEY_COMMON_TAG);
		if (!tags.isEmpty()) {
			for (String string : tags) {
				writer.startVoidA().withClass("tag info_tags_item info_tag").withData(string).text(string).endA().text(" ");
			}
		}

		for (Word word : data.keywords) {
			writer.startVoidA().withData(word.getId()).withClass("info_tags_item info_word word");
			writer.text(word.getText()).endA().text(" ");
		}

		writer.startA().withClass("add info_tags_item info_tags_add").text("Add word").endA();
		writer.endP();

		return writer.toString();
	}

	private void buildRendering(HTMLDocument document, ArticleData data, InternetAddressViewPerspective article, String algorithm, boolean highlight, StopWatch watch) throws ModelException,
			ExplodingClusterFuckException {

		{
			
			Document xom = document.getXOMDocument();
			if (xom==null) {
				log.warn("No XOM document");
				return;
			}
			ContentExtractor extractor = contentExtractors.get(algorithm);
			if (extractor==null) {
				log.warn("Unknown extrator: " + algorithm);
				extractor = new SimpleContentExtractor();
			}
			Document extracted = extractor.extract(xom);
			if (extracted == null) {
				article.setFormatted("<p><em>Unable to extract text.</em></p>");
			} else {

				DocumentToText doc2txt = new DocumentToText();
				String text = doc2txt.getText(extracted);
				article.setText("<p>" + text.trim().replaceAll("\n\n", "</p><p>").replaceAll("\n", "<br/>") + "</p>");

				DocumentCleaner cleaner = new DocumentCleaner();
				cleaner.setUrl(data.address.getAddress());
				cleaner.clean(extracted);
				
				Document annotated = annotate(article, data, highlight, extracted, watch);
				
				HTMLWriter formatted = new HTMLWriter();
				
				for (StatementPerspective statement : article.getQuotes()) {
					String cls = "reader_viewer_quote";
					if (!statement.isFound()) {
						cls+=" reader_viewer_quote-missing";
					}
					formatted.startBlockquote().withClass(cls).withData("id", statement.getId());
					formatted.text(statement.getText());
					List<ItemData> authors = statement.getAuthors();
					if (authors!=null && !authors.isEmpty()) {
						formatted.startSpan().text(" - ");
						for (int i = 0; i < authors.size(); i++) {
							if (i > 0) {
								formatted.text(", ");
							}
							formatted.text(authors.get(i).getText());
						}
					}
					formatted.startVoidA().withData("id", statement.getId()).withClass("oo_icon oo_icon_info_light reader_viewer_quote_icon js_action").endA();
					formatted.endBlockquote();
				}
				formatted.startDiv().withClass("reader_viewer_body");
				formatted.html(getBodyXML(annotated));
				formatted.endDiv();

				article.setFormatted(formatted.toString());

			}
		}
	}

	private String getBodyXML(Document document) {
		StringBuilder sb = new StringBuilder();
		XPathContext c = new XPathContext();
		c.addNamespace("html", document.getRootElement().getNamespaceURI());
		Nodes bodies = document.query("//html:body", c);
		if (bodies.size() > 0) {
			Node node = bodies.get(0);
			if (node instanceof Element) {
				Element body = (Element) node;
				int childCount = body.getChildCount();
				for (int i = 0; i < childCount; i++) {
					Node child = body.getChild(i);

					sb.append(child.toXML());
				}
			}
		}
		return sb.toString();
	}

	private Document annotate(InternetAddressViewPerspective article, ArticleData data, boolean highlight, Document xomDocument, StopWatch watch) throws ModelException, ExplodingClusterFuckException {
		watch.split();
		log.trace("Parsed HTML: " + watch.getSplitTime());
		
		List<StatementPerspective> statements = article.getQuotes();

		DecoratedDocument decorated = new DecoratedDocument(xomDocument);
		String text = decorated.getText();
		String textLowercased = text.toLowerCase();
		watch.split();
		log.trace("Decorated: " + watch.getSplitTime());

		Locale locale = languageService.getLocale(text);
		watch.split();
		log.trace("Get locale: " + watch.getSplitTime());
		if (highlight && locale!=null) {
			if (locale.getLanguage().equals("da") || locale.getLanguage().equals("en")) {
				annotatePeople(watch, decorated, text, locale);
			}
		}
		StringSearcher searcher = new StringSearcher();
		for (StatementPerspective statement : statements) {
			List<Result> found = searcher.search(statement.getText(), text);
			statement.setFirstPosition(text.length());
			for (Result result : found) {
				Map<String, Object> attributes = new HashMap<>();
				attributes.put("data-id", statement.getId());
				attributes.put("class", "quote");
				decorated.decorate(result.getFrom(), result.getTo(), "mark", attributes);
				
				statement.setFirstPosition(Math.min(result.getFrom(), statement.getFirstPosition()));
			}
			if (!found.isEmpty()) {
				statement.setFound(true);
			}
		}
		for (Word keyword : data.keywords) {
			List<Result> found = searcher.search(keyword.getText().toLowerCase(), textLowercased);
			for (Result result : found) {
				Map<String, Object> attributes = new HashMap<>();
				attributes.put("data-id", keyword.getId());
				attributes.put("class", "word");
				decorated.decorate(result.getFrom(), result.getTo(), "span", attributes);
			}
		}
		
		Collections.sort(statements,(a,b) -> {
			return a.getFirstPosition() - b.getFirstPosition();
		});
		decorated.build();
		Document document = decorated.getDocument();
		return document;
	}

	private void annotatePeople(StopWatch watch, DecoratedDocument decorated, String text, Locale locale) throws ExplodingClusterFuckException, ModelException {
		List<Span> nounSpans = Lists.newArrayList();

		List<String> nouns = Lists.newArrayList();

		String[] lines = text.split("\\n");
		int pos = 0;
		for (String line : lines) {
			Span[] sentences = semanticService.getSentencePositions(line, locale);
			watch.split();
			log.trace("Sentences: " + watch.getSplitTime());
			for (Span sentence : sentences) {
				// decorated.decorate(sentence.getStart(), sentence.getEnd(),
				// "mark", getClassMap("sentence") );

				String sentenceText = sentence.getCoveredText(line).toString();
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
					boolean prev = i > 0 && partOfSpeach[i - 1].startsWith("N") && Character.isUpperCase(sentenceTokens[i - 1].charAt(0));
					boolean next = i < sentenceTokenPositions.length - 1 && partOfSpeach[i + 1].startsWith("N") && Character.isUpperCase(sentenceTokens[i + 1].charAt(0));
					if (!(prev || next)) {
						continue;
					}
					nouns.add(token);
					Span spn = new Span(sentenceTokenPositions[i].getStart() + sentence.getStart() + pos, sentenceTokenPositions[i].getEnd() + sentence.getStart() + pos, token);
					nounSpans.add(spn);
				}
			}
			pos += 1;
			pos += line.length();
		}

		watch.split();
		log.trace("Part of speech: " + watch.getSplitTime());
		List<WordListPerspective> names = findNames(nouns);

		watch.split();
		log.trace("Find names: " + watch.getSplitTime());

		for (Span span : nounSpans) {
			String cls = "noun";
			if (isPerson(span.getType(), names)) {
				cls = "person";
			}
			decorated.decorate(span.getStart(), span.getEnd(), "mark", getClassMap(cls));
		}
	}

	private List<WordListPerspective> findNames(List<String> words) throws ModelException, ExplodingClusterFuckException {
		if (Code.isEmpty(words)) {

		}
		WordCategoryPerspectiveQuery query = new WordCategoryPerspectiveQuery().withWords(words);
		query.withCategories(LexicalCategory.CODE_PROPRIUM_FIRST, LexicalCategory.CODE_PROPRIUM_MIDDLE, LexicalCategory.CODE_PROPRIUM_LAST);
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
		attributes.put("class", cls);
		return attributes;
	}
	
	private class ArticleData {
		InternetAddress address;
		List<Word> keywords;
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
	
	public void setContentExtractors(Map<String,ContentExtractor> contentExtractors) {
		this.contentExtractors = contentExtractors;
	}
	
	public Map<String,ContentExtractor> getContentExtractors() {
		return contentExtractors;
	}
}
