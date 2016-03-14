package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.text.NumberFormat;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.commons.lang.StringSearcher;
import dk.in2isoft.commons.lang.StringSearcher.Result;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.xml.DOM;
import dk.in2isoft.commons.xml.DecoratedDocument;
import dk.in2isoft.commons.xml.DocumentCleaner;
import dk.in2isoft.commons.xml.DocumentToText;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.apps.reader.ReaderModelService;
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
import dk.in2isoft.onlineobjects.model.Hypothesis;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.information.ContentExtractor;
import dk.in2isoft.onlineobjects.modules.information.SimilarityQuery;
import dk.in2isoft.onlineobjects.modules.information.SimilarityQuery.Similarity;
import dk.in2isoft.onlineobjects.modules.language.TextDocumentAnalytics;
import dk.in2isoft.onlineobjects.modules.language.TextDocumentAnalyzer;
import dk.in2isoft.onlineobjects.modules.language.WordCategoryPerspectiveQuery;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.networking.InternetAddressService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import nu.xom.Attribute;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Nodes;
import nu.xom.ParentNode;
import nu.xom.XPathContext;
import opennlp.tools.util.Span;

public class InternetAddressViewPerspectiveBuilder {

	private static final Logger log = LoggerFactory.getLogger(InternetAddressViewPerspectiveBuilder.class);

	private ModelService modelService;
	private LanguageService languageService;
	private SemanticService semanticService;
	private Map<String,ContentExtractor> contentExtractors;
	private ReaderModelService readerModelService;
	private InternetAddressService internetAddressService;
	private TextDocumentAnalyzer textDocumentAnalyzer;

	public InternetAddressViewPerspective build(Long id, String algorithm, boolean highlight, UserSession session) throws ModelException, IllegalRequestException, SecurityException, ExplodingClusterFuckException {
		StopWatch watch = new StopWatch();
		watch.start();
		InternetAddress address = modelService.get(InternetAddress.class, id, session);
		if (address == null) {
			throw new IllegalRequestException("Not found");
		}

		TextDocumentAnalytics analytics = textDocumentAnalyzer.analyze(address, session);
		Document xom = DOM.parseXOM(analytics.getXml());
		//HTMLDocument document = internetAddressService.getHTMLDocument(address, session);
		
		ArticleData data = buildData(address);

		InternetAddressViewPerspective article = new InternetAddressViewPerspective();

		article.setTitle(address.getName());
		article.setUrl(address.getAddress());
		article.setAuthors(getAuthors(address, session));

		readerModelService.categorize(address, article, session);

		loadStatements(address, article, session);

		article.setHeader(buildHeader(address));
		article.setInfo(buildInfo(data, session));
		article.setId(address.getId());

		watch.split();
		log.trace("Base: " + watch.getSplitTime());
		if (xom != null) {
			buildRendering(xom, data, article, algorithm, highlight, watch, session);
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
			option.setId(p.getId());
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
		
		List<Hypothesis> hypotheses = modelService.getChildren(address, Relation.KIND_STRUCTURE_CONTAINS, Hypothesis.class, session);
		List<StatementPerspective> perpectives = hypotheses.stream().map((Hypothesis hypothesis) -> {
			StatementPerspective perspective = new StatementPerspective();
			perspective.setText(hypothesis.getText());
			perspective.setId(hypothesis.getId());
			perspective.setAuthors(getAuthors(hypothesis, session));
			return perspective;
		}).collect(Collectors.toList());
		article.setHypotheses(perpectives);
	}
	
	private ArticleData buildData(InternetAddress address) throws ModelException {
		ArticleData data = new ArticleData();
		User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
		data.address = address;
		data.keywords = modelService.getChildren(address, Word.class, admin);
		return data;
	}

	private String buildHeader(InternetAddress address) {
		HTMLWriter writer = new HTMLWriter();
		writer.startH1().text(address.getName()).endH1();
		writer.startP().startA().withClass("js_reader_action").withDataMap("action","openUrl","url",address.getAddress()).withTitle(address.getAddress()).withHref(address.getAddress()).text(Strings.simplifyURL(address.getAddress())).endA().endP();
		return writer.toString();
	}

	private String buildInfo(ArticleData data, UserSession session) throws ModelException {
		HTMLWriter writer = new HTMLWriter();
		writer.startH2().withClass("reader_meta_header").text("Tags").endH2();
		writer.startP().withClass("reader_meta_tags");

		List<String> tags = data.address.getPropertyValues(Property.KEY_COMMON_TAG);
		if (!tags.isEmpty()) {
			for (String string : tags) {
				writer.startVoidA().withClass("reader_meta_tags_item is-tag").withData(string).text(string).endA().text(" ");
			}
		}

		for (Word word : data.keywords) {
			writer.startVoidA().withData(word.getId()).withClass("reader_meta_tags_item is-word");
			writer.text(word.getText()).endA().text(" ");
		}

		writer.startA().withClass("reader_meta_tags_item is-add").text("Add word").endA();
		writer.endP();
		return writer.toString();
	}

	private void buildRendering(Document xom, ArticleData data, InternetAddressViewPerspective article, String algorithm, boolean highlight, StopWatch watch, Privileged session) throws ModelException,
			ExplodingClusterFuckException {

		{
			if (xom==null) {
				log.warn("No XOM document");
				return;
			}
			/*
			ContentExtractor extractor = contentExtractors.get(algorithm);
			if (extractor==null) {
				log.warn("Unknown extrator: " + algorithm);
				extractor = new SimpleContentExtractor();
			}
			Document extracted = extractor.extract(xom);
			*/
			Document extracted = xom;
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
				formatted.startDiv().withClass("reader_internetaddress_body");
				formatted.html(DOM.getBodyXML(annotated));
				formatted.endDiv();
				
				List<StatementPerspective> quotes = article.getQuotes();
				
				if (!quotes.isEmpty()) {
					formatted.startDiv().withClass("reader_internetaddress_footer");
					for (StatementPerspective statement : quotes) {
						String cls = "js_reader_action reader_internetaddress_quote";
						if (!statement.isFound()) {
							cls+=" reader_internetaddress_quote-missing";
						}
						formatted.startBlockquote().withClass(cls).withDataMap("action","highlightStatement","id",statement.getId());
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
						formatted.startVoidA().withClass("oo_icon oo_icon_info_light reader_internetaddress_quote_icon js_reader_action").withDataMap("action","editStatement","id",statement.getId()).endA();
						formatted.endBlockquote();
					}
					formatted.endDiv();
				}
				

				
				List<Similarity> list = modelService.list(new SimilarityQuery().withId(data.address.getId()));
				List<Long> ids = list.stream().map(e -> e.getId()).collect(Collectors.toList());
				List<InternetAddress> list2 = modelService.list(Query.after(InternetAddress.class).withPrivileged(session).withIds(ids));
				
				Function<Long,String> find = id -> {
					for (InternetAddress internetAddress : list2) {
						if (internetAddress.getId()==id) {
							return internetAddress.getName();
						}
					}
					return "- not found -";
				};
				
				NumberFormat numberFormat = NumberFormat.getPercentInstance();
				
				for (Similarity similarity : list) {
					formatted.startDiv().withClass("reader_meta_similar").text(numberFormat.format(similarity.getSimilarity())).text(" \u00B7 ").text(find.apply(similarity.getId())).endDiv();
				}
				
				article.setFormatted(formatted.toString());

			}
		}
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
				Map<String, Object> info = new HashMap<>();
				info.put("id", statement.getId());
				info.put("type", Statement.class.getSimpleName());
				info.put("description", "Statement: " + StringUtils.abbreviate(statement.getText(), 30));
				
				Map<String, Object> attributes = new HashMap<>();
				attributes.put("data-id", statement.getId());
				attributes.put("class", "reader_text_quote js_reader_item");
				attributes.put("data-info", Strings.toJSON(info));
				decorated.decorate(result.getFrom(), result.getTo(), "mark", attributes);
				
				statement.setFirstPosition(Math.min(result.getFrom(), statement.getFirstPosition()));
			}
			if (!found.isEmpty()) {
				statement.setFound(true);
			}
		}
		for (StatementPerspective hypothesis : article.getHypotheses()) {
			List<Result> found = searcher.search(hypothesis.getText(), text);
			hypothesis.setFirstPosition(text.length());
			for (Result result : found) {
				Map<String, Object> info = new HashMap<>();
				info.put("id", hypothesis.getId());
				info.put("type", Hypothesis.class.getSimpleName());
				info.put("description", "Hypothesis: " + StringUtils.abbreviate(hypothesis.getText(), 30));
				
				Map<String, Object> attributes = new HashMap<>();
				attributes.put("data-id", hypothesis.getId());
				attributes.put("class", "reader_text_hypothesis js_reader_item");
				attributes.put("data-info", Strings.toJSON(info));
				decorated.decorate(result.getFrom(), result.getTo(), "mark", attributes);
				
				hypothesis.setFirstPosition(Math.min(result.getFrom(), hypothesis.getFirstPosition()));
			}
			if (!found.isEmpty()) {
				hypothesis.setFound(true);
			}
		}
		for (Word keyword : data.keywords) {
			List<Result> found = searcher.search(keyword.getText().toLowerCase(), textLowercased);
			for (Result result : found) {
				Map<String, Object> info = new HashMap<>();
				info.put("id", keyword.getId());
				info.put("type", Word.class.getSimpleName());
				info.put("description", "Word: " + StringUtils.abbreviate(keyword.getText(), 30));
				
				Map<String, Object> attributes = new HashMap<>();
				attributes.put("data-id", keyword.getId());
				attributes.put("class", "reader_text_word js_reader_item");
				attributes.put("data-info", Strings.toJSON(info));
				decorated.decorate(result.getFrom(), result.getTo(), "span", attributes);
			}
		}
		
		Collections.sort(statements,(a,b) -> {
			return a.getFirstPosition() - b.getFirstPosition();
		});
		decorated.build();
		Document document = decorated.getDocument();
		annotateLinks(document);
		return document;
	}

	private void annotateLinks(Document document) {
		XPathContext context = new XPathContext();
		String namespaceURI = document.getRootElement().getNamespaceURI();
		context.addNamespace("html", namespaceURI);
		Nodes links = document.query("//html:a", context);
		for (int i = 0; i < links.size(); i++) {
			Element node = (Element) links.get(i);
			String href = node.getAttributeValue("href");
			if (href!=null && href.startsWith("http")) {
				Map<String, Object> info = new HashMap<>();
				info.put("type", "Link");
				info.put("url", href);
				info.put("description", "Link: " + Strings.simplifyURL(href));
				node.addAttribute(new Attribute("class", "js_reader_item"));
				node.addAttribute(new Attribute("data-info", Strings.toJSON(info)));
			}
		}
		Nodes images = document.query("//html:img", context);
		List<Element> imgs = Lists.newArrayList();
		for (int i = 0; i < images.size(); i++) {
			Element node = (Element) images.get(i);
			imgs.add(node);
		}
		for (Element node : imgs) {
			String width = node.getAttributeValue("width");
			String height = node.getAttributeValue("height");
			if (Strings.isInteger(width) && Strings.isInteger(height)) {
				float ratio = Float.parseFloat(height) / Float.parseFloat(width);
				Element wrapper = new Element("span", namespaceURI);
				wrapper.addAttribute(new Attribute("style", "max-width: " + width + "px;"));
				wrapper.addAttribute(new Attribute("class", "reader_view_picture"));
				ParentNode parent = node.getParent();
				parent.insertChild(wrapper, parent.indexOf(node));
				
				Element body = new Element("span", namespaceURI);
				body.addAttribute(new Attribute("class","reader_view_picture_body"));
				body.addAttribute(new Attribute("style", "padding-bottom: "+ (ratio * 100) + "%;"));
				
				body.appendChild(parent.removeChild(node));
				wrapper.appendChild(body);

				node.addAttribute(new Attribute("class", "reader_view_picture_img"));
			} else {
				node.addAttribute(new Attribute("class", "reader_view_img"));
			}
		}
		
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
	
	public void setReaderModelService(ReaderModelService readerModelService) {
		this.readerModelService = readerModelService;
	}

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
	
	public void setInternetAddressService(InternetAddressService internetAddressService) {
		this.internetAddressService = internetAddressService;
	}
	
	public void setContentExtractors(Map<String,ContentExtractor> contentExtractors) {
		this.contentExtractors = contentExtractors;
	}
	
	public Map<String,ContentExtractor> getContentExtractors() {
		return contentExtractors;
	}
	
	public void setTextDocumentAnalyzer(TextDocumentAnalyzer analyzer) {
		this.textDocumentAnalyzer = analyzer;
	}
}
