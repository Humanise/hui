package dk.in2isoft.onlineobjects.apps.reader;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.queryparser.flexible.standard.QueryParserUtil;

import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.ListMultimap;
import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListWriter;
import dk.in2isoft.onlineobjects.apps.reader.index.ReaderQuery;
import dk.in2isoft.onlineobjects.apps.reader.perspective.ArticlePerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.FeedPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.ListItemPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.WordPerspective;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.Results;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;
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
import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;
import dk.in2isoft.onlineobjects.ui.data.ViewResult;

public class ReaderController extends ReaderControllerBase {

	private static Logger log = Logger.getLogger(ReaderController.class);

	@Path(expression = "/script.[0-9]+.js")
	public void script(Request request) throws IOException, EndUserException {
		ScriptWriter writer = new ScriptWriter(request, configurationService);
		writer.write(publicScript);
	}

	@Path(expression = "/style.[0-9]+.css")
	public void style(Request request) throws IOException, EndUserException {
		StylesheetWriter writer = new StylesheetWriter(request, configurationService);
		writer.write(publicStyle);
	}
	
	private Pair<Integer,List<Entity>> search(Request request, int page, int pageSize) throws ExplodingClusterFuckException {
		ReaderQuery rQuery = new ReaderQuery();
		rQuery.setText(request.getString("text"));
		rQuery.setSubset(request.getString("subset"));
		rQuery.setType(request.getStrings("type"));
		rQuery.setPage(page);
		rQuery.setPageSize(pageSize);
		rQuery.setWordIds(request.getLongs("tags"));

		final ListMultimap<String, Long> idsByType = find(request, rQuery);
		final List<Long> ids = Lists.newArrayList(idsByType.values());

		List<Entity> list = Lists.newArrayList();
		{
			List<Long> addressIds = idsByType.get(InternetAddress.class.getSimpleName().toLowerCase());
			if (!addressIds.isEmpty()) {
				Query<InternetAddress> query = Query.after(InternetAddress.class).withIds(addressIds).withPrivileged(request.getSession());

				list.addAll(modelService.search(query).getList());
			}
		}
		{
			List<Long> partIds = idsByType.get(Statement.class.getSimpleName().toLowerCase());
			if (!partIds.isEmpty()) {
				Query<Statement> query = Query.after(Statement.class).withIds(partIds).withPrivileged(request.getSession());

				list.addAll(modelService.search(query).getList());
			}
		}

		sortByIds(list, ids);

		int totalCount = idsByType.get("total").iterator().next().intValue(); // TODO
		
		return Pair.of(totalCount, list);
	}

	@Path
	public ViewResult listAddressObjects(Request request) throws IOException, ModelException, ExplodingClusterFuckException {
		
		int page = request.getInt("page");
		int pageSize = request.getInt("pageSize");
		if (pageSize==0) {
			pageSize = 30;
		}

		Pair<Integer,List<Entity>> pair = search(request, page, pageSize);
		
		ViewResult result = new ViewResult();
		result.setTotal(pair.getKey());
		
		List<Entity> entities = pair.getValue();
		List<ListItemPerspective> list = Lists.newArrayList();
		for (Entity entity : entities) {
			
			ListItemPerspective perspective = new ListItemPerspective();
			perspective.setId(entity.getId());
			perspective.setTitle(entity.getName());
			
			InternetAddress address = null;
			
			HTMLWriter writer = new HTMLWriter();
			writer.startDiv().withClass("list_item");
			writer.startH2().withClass("list_item_title").text(entity.getName()).endH2();
			
			if (entity instanceof InternetAddress) {
				address = (InternetAddress) entity;
				perspective.setUrl(address.getAddress());
				perspective.setAddress(Strings.simplifyURL(address.getAddress()));
				writer.startP().withClass("list_item_address").startA().withClass("list_item_address_link").withHref(address.getAddress()).text(Strings.simplifyURL(address.getAddress())).endA().endP();
				perspective.setType("address");
			} else if (entity instanceof Statement) {
				Statement htmlPart = (Statement) entity;
				writer.startP().withClass("list_item_quote").text(htmlPart.getText()).endP();
				perspective.setType("statement");
			}

			List<Word> words = modelService.getChildren(entity, Word.class, request.getSession());
			if (Code.isNotEmpty(words)) {
				writer.startP().withClass("list_item_words");
				List<Pair<Long, String>> tags = Lists.newArrayList();
				for (Iterator<Word> i = words.iterator(); i.hasNext();) {
					Word word = i.next();
					tags.add(Pair.of(word.getId(), word.getText()));
					writer.startA().withClass("list_item_word").withData("id", word.getId()).text(word.getText()).endA();
					if (i.hasNext()) writer.text(" \u00B7 ");
				}
				perspective.setTags(tags);
				writer.endP();
			}
			writer.endDiv();
			perspective.setHtml(writer.toString());
			list.add(perspective);
		}
		result.setItems(list);

		return result;
	}

	@Path
	public void listAddresses(Request request) throws IOException, ModelException, ExplodingClusterFuckException {

		int page = request.getInt("page");
		int pageSize = 30;

		Pair<Integer,List<Entity>> pair = search(request, page, pageSize);
		
		int totalCount = pair.getKey();
		List<Entity> list = pair.getValue();
		

		ListWriter writer = new ListWriter(request);
		writer.startList();
		writer.window(totalCount, pageSize, page);

		writer.startHeaders();
		writer.header("Title").header("", 1);
		writer.endHeaders();
		for (Entity entity : list) {
			InternetAddress address = null;
			if (entity instanceof InternetAddress) {
				address = (InternetAddress) entity;
			}
			writer.startRow().withId(entity.getId()).withKind(entity.getClass().getSimpleName());
			writer.startCell().startLine();
			if (Strings.isBlank(entity.getName())) {
				writer.text("No name");
			} else {
				writer.text(entity.getName());
			}
			writer.endLine();

			if (address != null) {
				writer.startLine().dimmed().minor();
				writer.text(Strings.simplifyURL(address.getAddress()));
				List<Statement> quotes = modelService.getChildren(address, Relation.KIND_STRUCTURE_CONTAINS, Statement.class, request.getSession());
				if (quotes.size() > 0) {
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
			}
			writer.endCell();
			writer.startCell();
			writer.startIcons();
			if (address != null) {
				writer.startIcon().revealing().withAction().withIcon("monochrome/view").withData(address.getAddress()).endIcon();
			}
			writer.startIcon().revealing().withAction().withIcon("monochrome/graph").withData("graph").endIcon();
			writer.endIcons();
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}

	private void sortByIds(List<Entity> list, final List<Long> ids) {
		Collections.sort(list, new Comparator<Entity>() {

			public int compare(Entity o1, Entity o2) {
				int index1 = ids.indexOf(o1.getId());
				int index2 = ids.indexOf(o2.getId());
				if (index1 > index2) {
					return 1;
				} else if (index2 > index1) {
					return -1;
				}
				return 0;
			}
		});
	}

	private ListMultimap<String, Long> find(Request request, ReaderQuery query) throws ExplodingClusterFuckException {
		IndexManager index = getIndex(request);
		if (Strings.isBlank(query.getText()) && Strings.isBlank(query.getSubset())) {
			ListMultimap<String, Long> idsByType = index.getIdsByType();
			idsByType.put("total",Long.valueOf(idsByType.size()));
			return idsByType;
		}
		final ListMultimap<String, Long> ids = LinkedListMultimap.create();

		String indexQuery = buildQuery(query);
		SearchResult<IndexSearchResult> search = index.search(indexQuery.toString(), query.getPage(), query.getPageSize());
		for (IndexSearchResult row : search.getList()) {
			Long id = row.getLong("id");
			String type2 = row.getString("type");
			ids.put(type2, id);
		}
		ids.put("total", Long.valueOf(search.getTotalCount()));
		return ids;
	}

	private String buildQuery(ReaderQuery query) {
		String[] textParts = Strings.getWords(query.getText());

		StringBuilder indexQuery = new StringBuilder();

		Collection<String> types = query.getType();
		if (types != null && !types.isEmpty()) {
			indexQuery.append("(");
			for (Iterator<String> i = types.iterator(); i.hasNext();) {
				String type = (String) i.next();
				String tp = "pages".equals(type) ? InternetAddress.class.getSimpleName() : Statement.class.getSimpleName();
				indexQuery.append("type:").append(QueryParser.escape(tp)).append("");
				if (i.hasNext()) {
					indexQuery.append(" OR ");
				}
			}
			indexQuery.append(")");
		}

		for (String string : textParts) {
			if (indexQuery.length() > 0) {
				indexQuery.append(" AND ");
			}
			indexQuery.append("(");
			indexQuery.append("title:").append(QueryParserUtil.escape(string)).append("*^4");
			indexQuery.append(" OR words:").append(QueryParserUtil.escape(string)).append("*^2");
			indexQuery.append(" OR text:").append(QueryParserUtil.escape(string)).append("*");
			indexQuery.append(")");
		}
		if (query.getWordIds() != null) {
			for (Long id : query.getWordIds()) {
				if (indexQuery.length() > 0) {
					indexQuery.append(" AND ");
				}
				indexQuery.append("word:").append(id);
			}
		}
		if ("inbox".equals(query.getSubset())) {
			if (indexQuery.length() > 0) {
				indexQuery.append(" AND ");
			}
			indexQuery.append("inbox:yes");
		}
		if ("favorite".equals(query.getSubset())) {
			if (indexQuery.length() > 0) {
				indexQuery.append(" AND ");
			}
			indexQuery.append("favorite:yes");
		} else if ("archive".equals(query.getSubset())) {
			if (indexQuery.length() > 0) {
				indexQuery.append(" AND ");
			}
			indexQuery.append("inbox:no");
		}
		return indexQuery.toString();
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
	public List<ItemData> getTypeOptions(Request request) throws ModelException {
		List<ItemData> options = Lists.newArrayList();
		options.add(new ItemData("pages").withText("Pages").withIcon("document_line"));
		options.add(new ItemData("quotes").withText("Quotes").withIcon("bubble_line"));
		return options;
	}

	@Path
	public List<ItemData> getContextOptions(Request request) throws ModelException {
		List<ItemData> options = Lists.newArrayList();
		options.add(new ItemData("everything").withText("Everything").withIcon("documents_line"));
		options.add(new ItemData("inbox").withText("Inbox").withIcon("inbox_line"));
		options.add(new ItemData("archive").withText("Archive").withIcon("archive_line"));
		options.add(new ItemData("favorite").withText("Favorites").withIcon("star_line"));
		return options;
	}

	private Pile getFeedPile(UserSession session) throws ModelException {
		return pileService.getOrCreatePileByKey("feeds", session.getUser());
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
			throw new NetworkException("Unable to fetch " + url);
		} finally {
			if (response != null) {
				response.cleanUp();
			}
		}
	}

	@Path
	public void changeFavoriteStatus(Request request) throws ModelException, SecurityException, IllegalRequestException {
		Long id = request.getLong("id");
		boolean favorite = request.getBoolean("favorite");

		UserSession session = request.getSession();

		InternetAddress address = modelService.get(InternetAddress.class, id, session);
		Code.checkNotNull(address, "Address not found");

		pileService.addOrRemoveFromPile(session.getUser(), Relation.KIND_SYSTEM_USER_FAVORITES, address, favorite);
	}

	@Path
	public void changeInboxStatus(Request request) throws ModelException, SecurityException, IllegalRequestException {
		Long id = request.getLong("id");
		boolean inbox = request.getBoolean("inbox");

		UserSession session = request.getSession();

		InternetAddress address = modelService.get(InternetAddress.class, id, session);
		Code.checkNotNull(address, "Address not found");
		pileService.addOrRemoveFromPile(session.getUser(), Relation.KIND_SYSTEM_USER_INBOX, address, inbox);
	}

	@Path
	public ArticlePerspective loadArticle(Request request) throws IOException, ModelException, SecurityException, IllegalRequestException, ExplodingClusterFuckException, ContentNotFoundException {
		Long articleId = request.getLong("id",null);
		Long statementId = request.getLong("statementId", null);
		String algorithm = request.getString("algorithm");
		UserSession session = request.getSession();
		
		if (articleId==null && statementId==null) {
			throw new IllegalRequestException("No id provided");
		}
		if (articleId==null) {
			Query<InternetAddress> query = Query.after(InternetAddress.class).withChild(statementId, Relation.KIND_STRUCTURE_CONTAINS);
			InternetAddress address = modelService.search(query).getFirst();
			if (address==null) {
				throw new ContentNotFoundException();
			}
			articleId = address.getId();
		}
		return articleBuilder.getArticlePerspective(articleId, algorithm, session);
	}

	@Path
	public ArticlePerspective addQuote(Request request) throws IOException, ModelException, SecurityException, IllegalRequestException, ExplodingClusterFuckException, ContentNotFoundException {
		Long id = request.getLong("id");
		String text = request.getString("text");
		if (Strings.isNotBlank(text)) {
			if (text.length() > 10000) {
				// TODO Handle this better
				throw new IllegalRequestException("Text too long");
			}
			Privileged session = request.getSession();
			InternetAddress address = modelService.get(InternetAddress.class, id, session);
			if (address != null) {
				Statement part = new Statement();
				part.setName(StringUtils.abbreviate(text, 50));
				part.setText(text);
				modelService.createItem(part, session);
				modelService.createRelation(address, part, Relation.KIND_STRUCTURE_CONTAINS, session);
			}
		}

		return loadArticle(request);
	}

	@Path
	public SimpleEntityPerspective addInternetAddress(Request request) throws ModelException {
		String url = request.getString("url");

		InternetAddress internetAddress = new InternetAddress();
		internetAddress.setAddress(url);
		HTMLDocument doc = htmlService.getDocumentSilently(url);
		if (doc != null) {
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

		Privileged privileged = request.getSession();
		InternetAddress address = modelService.get(InternetAddress.class, id, privileged);
		Code.checkNotNull(id, "Address not found");

		List<Statement> children = modelService.getChildren(address, Relation.KIND_STRUCTURE_CONTAINS, Statement.class, privileged);

		modelService.deleteEntity(address, privileged);

		for (Statement htmlPart : children) {
			modelService.deleteEntity(htmlPart, privileged);
		}
	}

	@Path
	public void addWord(Request request) throws ModelException {
		Long internetAddressId = request.getLong("internetAddressId");
		Long wordId = request.getLong("wordId");
		UserSession session = request.getSession();
		InternetAddress internetAddress = modelService.get(InternetAddress.class, internetAddressId, session);
		Word word = modelService.get(Word.class, wordId, session);
		Relation relation = modelService.getRelation(internetAddress, word);
		if (relation == null) {
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
		if (relation != null) {
			modelService.deleteRelation(relation, modelService.getUser(SecurityService.ADMIN_USERNAME));
		}
	}

	@Path
	public void removeTag(Request request) throws ModelException, SecurityException, IllegalRequestException {
		Long internetAddressId = request.getLong("internetAddressId");
		String tag = request.getString("tag");
		UserSession session = request.getSession();
		InternetAddress internetAddress = modelService.get(InternetAddress.class, internetAddressId, session);
		if (internetAddress==null) {
			throw new IllegalRequestException("Not found");
		}
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
		Long id = request.getLong("id");
		query.withIds(Lists.newArrayList(id));
		WordListPerspective row = modelService.search(query).getFirst();
		if (row != null) {
			HTMLWriter html = new HTMLWriter();
			html.startDiv().withClass("word_rendering");
			html.startH1().text(row.getText()).endH1();
			html.endDiv();
			WordPerspective perspective = new WordPerspective();
			perspective.setRendering(html.toString());
			perspective.setId(row.getId());
			return perspective;
		}
		log.warn("Word not found: id=" + id);
		return null;
	}

	@Path
	public List<ItemData> getWordCloud(Request request) throws ModelException {
		WordByInternetAddressQuery query = new WordByInternetAddressQuery(request.getSession());
/*		List<ItemData> list = modelService.list(query);
		Collections.sort(list, (o1, o2) -> {
			return Strings.compareCaseless(o1.getText(),o2.getText());
		});*/
		return modelService.list(query);
	}

	@Path
	public void reIndex(Request request) throws EndUserException {
		Privileged privileged = request.getSession();
		readerIndexer.clear(request.getSession());
		{
			Query<InternetAddress> query = Query.after(InternetAddress.class).withPrivileged(privileged);
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
		{
			Query<Statement> query = Query.after(Statement.class).withPrivileged(request.getSession());
			Results<Statement> scroll = modelService.scroll(query);
			try {
				while (scroll.next()) {
					Statement statement = scroll.get();
					readerIndexer.index(statement);
				}
			} finally {
				scroll.close();
			}
		}
	}

	private IndexManager getIndex(Request request) {
		return indexService.getIndex("app-reader-user-" + request.getSession().getIdentity());
	}
}
