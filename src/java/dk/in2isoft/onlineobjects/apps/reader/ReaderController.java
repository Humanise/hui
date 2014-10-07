package dk.in2isoft.onlineobjects.apps.reader;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexableField;
import org.apache.lucene.queryparser.flexible.standard.QueryParserUtil;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListWriter;
import dk.in2isoft.onlineobjects.apps.reader.perspective.ArticlePerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.FeedPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.WordPerspective;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.Results;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.HtmlPart;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.feeds.Feed;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexSearchResult;
import dk.in2isoft.onlineobjects.modules.language.WordByInternetAddressQuery;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.modules.networking.NetworkResponse;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.ScriptWriter;
import dk.in2isoft.onlineobjects.ui.StylesheetWriter;
import dk.in2isoft.onlineobjects.ui.data.Option;
import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;


public class ReaderController extends ReaderControllerBase {
	
	private static Logger log = Logger.getLogger(ReaderController.class);

	@Path(expression="/script.[0-9]+.js")
	public void script(Request request) throws IOException, EndUserException {
		ScriptWriter writer = new ScriptWriter(request, configurationService);
		writer.write(publicScript);
	}

	@Path(expression="/style.[0-9]+.css")
	public void style(Request request) throws IOException, EndUserException {
		StylesheetWriter writer = new StylesheetWriter(request, configurationService);
		writer.write(publicStyle);
	}
	
	@Path
	public void listAddresses(Request request) throws IOException, ModelException {
		
		int page = request.getInt("page");
		String text = request.getString("text");
		int pageSize = 30;
		
		List<Long> tagIDs = request.getLongList("tags");

		ListWriter writer = new ListWriter(request);
		
		Query<InternetAddress> query = Query.after(InternetAddress.class).withWords(text).withPrivileged(request.getSession()).withPaging(page, 30);
		
		if (!tagIDs.isEmpty()) {
			List<Word> words = modelService.list(Query.after(Word.class).withIds(tagIDs));
			query.withChildren(words);
		}
		
		SearchResult<InternetAddress> result = modelService.search(query);
		
		writer.startList();
		writer.window(result.getTotalCount(), pageSize, page);
		
		writer.startHeaders();
		writer.header("Title").header("",1);
		writer.endHeaders();
		
		
		
		for (InternetAddress address : result.getList()) {
			writer.startRow().withId(address.getId());
			writer.startCell().startLine();
			if (Strings.isBlank(address.getName())) {
				writer.text("No name");
			} else {
				writer.text(address.getName());
			}
			writer.endLine();
			writer.startLine().dimmed().minor().text(Strings.simplifyURL(address.getAddress())).endLine();
			List<Word> words = modelService.getChildren(address, Word.class, request.getSession());
			if (Code.isNotEmpty(words)) {
				HTMLWriter wordLine = new HTMLWriter(); 
				wordLine.startP().withClass("reader_list_words");
				for (Iterator<Word> i = words.iterator(); i.hasNext();) {
					Word word = i.next();
					wordLine.startVoidA().withClass("reader_list_word").withData("id", word.getId()).text(word.getText()).endA();
					if (i.hasNext()) {
						writer.text(" ");
					}
				}
				wordLine.endP();
				writer.html(wordLine);
			}
			writer.endCell();
			writer.startCell();
			writer.startIcons();
			writer.startIcon().revealing().withAction().withIcon("monochrome/view").withData(address.getAddress()).endIcon();
			writer.startIcon().revealing().withAction().withIcon("monochrome/graph").withData(address.getAddress()).endIcon();
			writer.endIcons();
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}
	
	@Path
	public void searchAddresses(Request request) throws IOException, ModelException, ExplodingClusterFuckException {
		
		int page = request.getInt("page");
		String text = request.getString("text");
		int pageSize = 30;
		
		List<Long> tagIDs = request.getLongList("tags");

		ListWriter writer = new ListWriter(request);
		
		final List<Long> ids = find(request, text);
		
		if (!Strings.isBlank(text) && ids.isEmpty()) {
			ids.add(-1l);
		}
		
		Query<InternetAddress> query = Query.after(InternetAddress.class).withIds(ids).withPrivileged(request.getSession()).withPaging(page, 30);
		
		if (!tagIDs.isEmpty()) {
			List<Word> words = modelService.list(Query.after(Word.class).withIds(tagIDs));
			query.withChildren(words);
		}
		
		SearchResult<InternetAddress> result = modelService.search(query);
		
		writer.startList();
		writer.window(result.getTotalCount(), pageSize, page);
		
		writer.startHeaders();
		writer.header("Title").header("",1);
		writer.endHeaders();
		
		
		
		List<InternetAddress> list = result.getList();
		

		Collections.sort(list, new Comparator<InternetAddress>() {

			public int compare(InternetAddress o1, InternetAddress o2) {
				int index1 = ids.indexOf(o1.getId());
				int index2 = ids.indexOf(o2.getId());
				if (index1>index2) {
					return 1;
				} else if (index2>index1) {
					return -1;
				}
				return 0;
			}
		});
		
		for (InternetAddress address : list) {
			
			writer.startRow().withId(address.getId());
			writer.startCell().startLine();
			if (Strings.isBlank(address.getName())) {
				writer.text("No name");
			} else {
				writer.text(address.getName());
			}
			writer.endLine();
			writer.startLine().dimmed().minor();
			writer.text(Strings.simplifyURL(address.getAddress()));
			List<HtmlPart> quotes = modelService.getChildren(address, Relation.KIND_STRUCTURE_CONTAINS, HtmlPart.class,request.getSession());
			if (quotes.size()>0) {
				writer.text(" (").text(quotes.size()).text(")");
			}
			writer.endLine();
			List<Word> words = modelService.getChildren(address, Word.class, request.getSession());
			if (Code.isNotEmpty(words)) {
				HTMLWriter wordLine = new HTMLWriter(); 
				wordLine.startP().withClass("reader_list_words");
				for (Iterator<Word> i = words.iterator(); i.hasNext();) {
					Word word = i.next();
					wordLine.startVoidA().withClass("reader_list_word").withData("id", word.getId()).text(word.getText()).endA();
					if (i.hasNext()) {
						writer.text(" ");
					}
				}
				wordLine.endP();
				writer.html(wordLine);
			}
			writer.endCell();
			writer.startCell();
			writer.startIcons();
			writer.startIcon().revealing().withAction().withIcon("monochrome/view").withData(address.getAddress()).endIcon();
			writer.startIcon().revealing().withAction().withIcon("monochrome/graph").withData("graph").endIcon();
			writer.endIcons();
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}

	private List<Long> find(Request request, String text) throws ExplodingClusterFuckException {
		IndexManager index = getIndex(request);
		if (Strings.isBlank(text)) {
			return index.getAllIds();
		}
		final List<Long> ids = Lists.newArrayList();
		StringBuilder indexQuery = new StringBuilder();
		
		String[] textParts = Strings.getWords(text);
		
		for (String string : textParts) {
			if (indexQuery.length()>0) {
				indexQuery.append(" AND ");
			}
			indexQuery.append("(");
			indexQuery.append("title:").append(QueryParserUtil.escape(string)).append("*^4");
			indexQuery.append(" OR words:").append(QueryParserUtil.escape(string)).append("*^2");
			indexQuery.append(" OR text:").append(QueryParserUtil.escape(string)).append("*");
			indexQuery.append(")");
		}
		SearchResult<IndexSearchResult> search = index.search(indexQuery.toString(), 0, Integer.MAX_VALUE);
		for (IndexSearchResult row : search.getList()) {
			Document document = row.getDocument();
			IndexableField field = document.getField("id");
			ids.add(Long.parseLong(field.stringValue()));
		}
		return ids;
	}
	
	@Path
	public List<FeedPerspective> getFeeds(Request request) throws ModelException {
		UserSession session = request.getSession();
		Pile pile = getFeedPile(session);
		List<InternetAddress> children = modelService.getChildren(pile, InternetAddress.class, session);
		List<FeedPerspective> options = Lists.newArrayList();
		for (InternetAddress internetAddress : children) {
			options.add(new FeedPerspective(internetAddress.getName(), internetAddress.getId()));
		}
		return options;
	}

	@Path
	public List<Option> getTypeOptions(Request request) throws ModelException {
		List<Option> options = Lists.newArrayList();
		options.add(new Option("Pages","pages"));
		options.add(new Option("Quotes","quotes"));
		return options;
	}

	@Path
	public List<Option> getContextOptions(Request request) throws ModelException {
		List<Option> options = Lists.newArrayList();
		options.add(new Option("Inbox","inbox"));
		options.add(new Option("Verified","verified"));
		return options;
	}

	private Pile getFeedPile(UserSession session) throws ModelException {
		return pileService.getOrCreateUsersPile("feeds", session.getUser(), session);
	}
	
	@Path
	public void addFeed(Request request) throws ModelException, IllegalRequestException, NetworkException {
		String url = request.getString("url");
		NetworkResponse response = null;
		try {
			response = networkService.get(url);
			if (response.isSuccess()) {
				Feed feed = feedService.parse(response.getFile());
				UserSession session = request.getSession();
				Pile feeds = getFeedPile(session);
				InternetAddress address = new InternetAddress();
				address.setName(feed.getTitle());
				address.setAddress(url);
				modelService.createItem(address, session);
				modelService.createRelation(feeds, address, session);
			}
		} catch (URISyntaxException e) {
			throw new IllegalRequestException("The URL is not well formed");
		} catch (IOException e) {
			throw new NetworkException("Unable to fetch "+url);
		} finally {
			if (response!=null) {
				response.cleanUp();
			}
		}
	}
	
	@Path
	public ArticlePerspective loadArticle(Request request) throws IOException, ModelException, SecurityException {
		Long id = request.getLong("id");
		
		UserSession session = request.getSession();
		InternetAddress address = modelService.get(InternetAddress.class, id, session);
				
		HTMLDocument document = getHTMLDocument(address, session);
		
		ArticlePerspective article = new ArticlePerspective();
		
		List<HtmlPart> quotes = modelService.getChildren(address, Relation.KIND_STRUCTURE_CONTAINS, HtmlPart.class,request.getSession());
		List<Pair<Long,String>> x = Lists.newArrayList();
		for (HtmlPart htmlPart : quotes) {
			x.add(Pair.of(htmlPart.getId(), htmlPart.getHtml()));
		}
		article.setQuotes(x);
		
		article.setInfo(buildInfo(document, address, session));
		article.setId(address.getId());
		if (document!=null) {
			article.setTitle(document.getTitle());
			article.setRendering(buildRendering(document, address));
		} else {
			article.setTitle(address.getName());
		}
		
		return article;
	}
	
	private HTMLDocument getHTMLDocument(InternetAddress address, Privileged privileged) throws SecurityException, ModelException {
		
		File folder = storageService.getItemFolder(address);
		File original = new File(folder,"original");
		String encoding = address.getPropertyValue(Property.KEY_INTERNETADDRESS_ENCODING);
		if (Strings.isBlank(encoding)) {
			encoding = Strings.UTF8;
		}
		if (!original.exists()) {
			NetworkResponse response = networkService.getSilently(address.getAddress());
			if (response!=null && response.isSuccess()) {
				File temp = response.getFile();
				if (!Files.copy(temp,original)) {
					response.cleanUp();
					return null;
				}
				address.overrideFirstProperty(Property.KEY_INTERNETADDRESS_ENCODING, encoding);
				modelService.updateItem(address, privileged);
			}
		}
		return new HTMLDocument(Files.readString(original, encoding));
	}

	private String buildInfo(HTMLDocument document, InternetAddress address, UserSession session) throws ModelException {
		HTMLWriter writer = new HTMLWriter();
		writer.startH1().text(address.getName()).endH1();
		writer.startP().withClass("link").startA().withHref(address.getAddress()).text(address.getAddress()).endA().endP();
		writer.startP().withClass("tags");
		{
			List<String> tags = address.getPropertyValues(Property.KEY_COMMON_TAG);
			if (!tags.isEmpty()) {
				for (String string : tags) {
					writer.startVoidA().withClass("tag").withData(string).text(string).endA().text(" ");
				}
			}
		}
		{
			User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
			List<Word> words = modelService.getChildren(address, Word.class,admin);
			for (Word word : words) {
				if (word==null || address==null) {
					continue;
				}
				writer.startVoidA().withData(word.getId()).withClass("word");
				writer.text(word.getText()).endA().text(" ");
			}

		}
		writer.startA().withClass("add").text("Add word").endA();
		writer.endP();
		
		return writer.toString();
	}

	private String buildRendering(HTMLDocument document, InternetAddress address) {
		String content = document.getExtractedContents();
		
		HTMLWriter writer = new HTMLWriter();
		
		if (Strings.isNotBlank(content)) {
			String[] lines = StringUtils.split(content, "\n");
			writer.startDiv().withClass("body");
			for (int i = 0; i < lines.length; i++) {
				writer.startP().text(lines[i]).endP();
			}
			writer.endDiv();
		}
		return writer.toString();
	}
	
	@Path
	public SimpleEntityPerspective addInternetAddress(Request request) throws ModelException {
		String url = request.getString("url");
		
		InternetAddress internetAddress = new InternetAddress();
		internetAddress.setAddress(url);
		HTMLDocument doc = htmlService.getDocumentSilently(url);
		if (doc!=null) {
			internetAddress.setName(doc.getTitle());
		} else {
			internetAddress.setName(Strings.simplifyURL(url));
		}
		modelService.createItem(internetAddress, request.getSession());
		
		return SimpleEntityPerspective.create(internetAddress);
	}
	
	@Path
	public void removeInternetAddress(Request request) throws ModelException, IllegalRequestException, SecurityException {
		Long id = request.getLong("id");
		Code.checkNotNull(id, "No id provided");
		
		InternetAddress address = modelService.get(InternetAddress.class, id, request.getSession());
		Code.checkNotNull(id, "Address not found");
		
		modelService.deleteEntity(address, request.getSession());
	}

	@Path
	public void addWord(Request request) throws ModelException {
		Long internetAddressId = request.getLong("internetAddressId");
		Long wordId = request.getLong("wordId");
		UserSession session = request.getSession();
		InternetAddress internetAddress = modelService.get(InternetAddress.class, internetAddressId, session);
		Word word = modelService.get(Word.class, wordId, session);
		Relation relation = modelService.getRelation(internetAddress, word);
		if (relation==null) {
			modelService.createRelation(internetAddress, word, session);
		}
	}

	@Path
	public void removeWord(Request request) throws ModelException, SecurityException {
		Long internetAddressId = request.getLong("internetAddressId");
		Long wordId = request.getLong("wordId");
		UserSession session = request.getSession();
		InternetAddress internetAddress = modelService.get(InternetAddress.class, internetAddressId, session);
		Word word = modelService.get(Word.class, wordId, session);
		Relation relation = modelService.getRelation(internetAddress, word);
		if (relation!=null) {
			modelService.deleteRelation(relation, modelService.getUser(SecurityService.ADMIN_USERNAME));
		}
	}

	@Path
	public void removeTag(Request request) throws ModelException, SecurityException {
		Long internetAddressId = request.getLong("internetAddressId");
		String tag = request.getString("tag");
		UserSession session = request.getSession();
		InternetAddress internetAddress = modelService.get(InternetAddress.class, internetAddressId, session);
		Collection<Property> properties = internetAddress.getProperties();
		for (Iterator<Property> i = properties.iterator(); i.hasNext();) {
			Property property = i.next();
			if (Property.KEY_COMMON_TAG.equals(property.getKey()) && tag.equals(property.getValue())) {
				i.remove();
			}
		}
		modelService.updateItem(internetAddress, session);
	}
	
	@Path
	public WordPerspective getWordInfo(Request request) throws ModelException {
		WordListPerspectiveQuery query = new WordListPerspectiveQuery();
		query.withIds(Lists.newArrayList(request.getLong("id")));
		WordListPerspective row = modelService.search(query).getFirst();
		if (row!=null) {
			HTMLWriter html = new HTMLWriter();
			html.startDiv().withClass("word_rendering");
			html.startH1().text(row.getText()).endH1();
			html.endDiv();
			WordPerspective perspective = new WordPerspective();
			perspective.setRendering(html.toString());
			perspective.setId(row.getId());
			return perspective;
		}
		return null;
	}
	
	@Path
	public List<ItemData> getWordCloud(Request request) throws ModelException {
		WordByInternetAddressQuery query = new WordByInternetAddressQuery(request.getSession());
		return modelService.list(query);
	}
	
	@Path
	public void reIndex(Request request) throws EndUserException {
		readerIndexer.clear(request.getSession());
		Query<InternetAddress> query = Query.after(InternetAddress.class).withPrivileged(request.getSession());
		Results<InternetAddress> scroll = modelService.scroll(query);
		try {
			while (scroll.next()) {
				InternetAddress address = scroll.get();
				readerIndexer.index(address);
			}
		} finally {
			scroll.close();
		}
	}

	private IndexManager getIndex(Request request) {
		return indexService.getIndex("app-reader-user-"+request.getSession().getIdentity());
	}
}
