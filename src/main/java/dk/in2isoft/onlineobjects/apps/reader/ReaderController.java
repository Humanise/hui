package dk.in2isoft.onlineobjects.apps.reader;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.eclipse.jdt.annotation.Nullable;

import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.ListMultimap;
import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.apps.reader.index.ReaderQuery;
import dk.in2isoft.onlineobjects.apps.reader.perspective.AddressEditPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.ArticlePerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.FeedPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.ListItemPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.StatementEditPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.WordPerspective;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
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
import dk.in2isoft.onlineobjects.model.Hypothesis;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Question;
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
import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;
import dk.in2isoft.onlineobjects.ui.data.ViewResult;

public class ReaderController extends ReaderControllerBase {

	private static Logger log = Logger.getLogger(ReaderController.class);
	
	private Pair<Integer,List<Entity>> search(Request request, int page, int pageSize) throws ExplodingClusterFuckException {
		ReaderQuery readerQuery = new ReaderQuery();
		readerQuery.setText(request.getString("text"));
		readerQuery.setSubset(request.getString("subset"));
		readerQuery.setType(request.getStrings("type"));
		readerQuery.setPage(page);
		readerQuery.setPageSize(pageSize);
		readerQuery.setWordIds(request.getLongs("tags"));
		readerQuery.setAuthorIds(request.getLongs("authors"));

		final ListMultimap<String, Long> idsByType = find(request, readerQuery);
		final List<Long> ids = Lists.newArrayList(idsByType.values());

		List<Entity> list = Lists.newArrayList();
		UserSession session = request.getSession();
		{
			List<Long> addressIds = idsByType.get(InternetAddress.class.getSimpleName().toLowerCase());
			if (!addressIds.isEmpty()) {
				Query<InternetAddress> query = Query.after(InternetAddress.class).withIds(addressIds).withPrivileged(session);

				list.addAll(modelService.list(query));
			}
		}
		{
			List<Long> partIds = idsByType.get(Statement.class.getSimpleName().toLowerCase());
			if (!partIds.isEmpty()) {
				Query<Statement> query = Query.after(Statement.class).withIds(partIds).withPrivileged(session);

				list.addAll(modelService.list(query));
			}
		}
		{
			List<Long> partIds = idsByType.get(Question.class.getSimpleName().toLowerCase());
			if (!partIds.isEmpty()) {
				Query<Question> query = Query.after(Question.class).withIds(partIds).withPrivileged(session);

				list.addAll(modelService.list(query));
			}
		}
		{
			List<Long> partIds = idsByType.get(Hypothesis.class.getSimpleName().toLowerCase());
			if (!partIds.isEmpty()) {
				Query<Hypothesis> query = Query.after(Hypothesis.class).withIds(partIds).withPrivileged(session);

				list.addAll(modelService.list(query));
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
			perspective.setTitle(entity.getName());
			
			InternetAddress address = null;
			
			HTMLWriter writer = new HTMLWriter();
			writer.startDiv().withClass("reader_list_item");
			String title = entity.getName();
			if (Strings.isBlank(title)) {
				title = "-- empty --";
			}
			
			if (entity instanceof InternetAddress) {
				writer.startH2().withClass("reader_list_title").text(title).endH2();
				perspective.setAddressId(entity.getId());
				address = (InternetAddress) entity;
				perspective.setUrl(address.getAddress());
				perspective.setAddress(Strings.simplifyURL(address.getAddress()));
				writer.startP().withClass("reader_list_address").startA().withClass("reader_list_address_link").withHref(address.getAddress()).text(Strings.getSimplifiedDomain(address.getAddress())).endA().endP();
				perspective.setType("address");
			} else if (entity instanceof Statement) {
				Query<Person> personQuery = Query.after(Person.class).from(entity, Relation.KIND_COMMON_AUTHOR).withPrivileged(request.getSession());
				List<Person> authors = modelService.list(personQuery);
				perspective.setStatementId(entity.getId());
				Statement htmlPart = (Statement) entity;
				writer.startP().withClass("reader_list_quote").text(htmlPart.getText()).endP();
				if (Code.isNotEmpty(authors)) {
					writer.startDiv().withClass("reader_list_authors");
					for (Iterator<Person> i = authors.iterator(); i.hasNext();) {
						Person person = (Person) i.next();
						writer.text(person.getFullName());
						if (i.hasNext()) {
							writer.text(", ");
						}
					}
					writer.endDiv();
				}
				perspective.setType("statement");
				Query<InternetAddress> query = Query.after(InternetAddress.class).to(entity, Relation.KIND_STRUCTURE_CONTAINS).withPrivileged(request.getSession());
				InternetAddress addr = modelService.search(query).getFirst();
				if (addr!=null) {
					perspective.setAddressId(addr.getId());
				}
			} else if (entity instanceof Question) {
				perspective.setType("question");
				perspective.setQuestionId(entity.getId());
				Question question = (Question) entity;
				writer.startP().withClass("reader_list_question").text(question.getText()).endP();
			} else if (entity instanceof Hypothesis) {
				perspective.setType("hypothesis");
				perspective.setHypothesisId(entity.getId());
				Hypothesis question = (Hypothesis) entity;
				writer.startP().withClass("reader_list_hypothesis").text(question.getText()).endP();
			}

			List<Word> words = modelService.getChildren(entity, Word.class, request.getSession());
			if (Code.isNotEmpty(words)) {
				writer.startP().withClass("reader_list_words");
				List<Pair<Long, String>> tags = Lists.newArrayList();
				for (Iterator<Word> i = words.iterator(); i.hasNext();) {
					Word word = i.next();
					tags.add(Pair.of(word.getId(), word.getText()));
					writer.startA().withClass("reader_list_word").withData("id", word.getId()).text(word.getText()).endA();
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

		String indexQuery = ReaderQuery.build(query);
		SearchResult<IndexSearchResult> search = index.search(indexQuery.toString(), query.getPage(), query.getPageSize());
		for (IndexSearchResult row : search.getList()) {
			Long id = row.getLong("id");
			String type = row.getString("type");
			ids.put(type, id);
		}
		ids.put("total", Long.valueOf(search.getTotalCount()));
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
	public List<ItemData> getTypeOptions(Request request) throws ModelException {
		List<ItemData> options = Lists.newArrayList();
		options.add(new ItemData("any").withText("Any").withIcon("documents_line"));
		options.add(new ItemData(InternetAddress.class.getSimpleName()).withText("Pages").withIcon("document_line"));
		options.add(new ItemData(Statement.class.getSimpleName()).withText("Quotes").withIcon("quote"));
		options.add(new ItemData(Question.class.getSimpleName()).withText("Questions").withIcon("question"));
		options.add(new ItemData(Hypothesis.class.getSimpleName()).withText("Theories").withIcon("hypothesis"));
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
		//Long statementId = request.getLong("statementId", null);
		String algorithm = request.getString("algorithm");
		UserSession session = request.getSession();
		
		if (articleId==null) {
			throw new IllegalRequestException("No id provided");
		}
		/*
		if (articleId==null) {
			Query<InternetAddress> query = Query.after(InternetAddress.class).withChild(statementId, Relation.KIND_STRUCTURE_CONTAINS);
			InternetAddress address = modelService.search(query).getFirst();
			if (address==null) {
				throw new ContentNotFoundException();
			}
			articleId = address.getId();
		}*/
		return articleBuilder.getArticlePerspective(articleId, algorithm, session);
	}

	@Path
	public void addQuote(Request request) throws IOException, ModelException, SecurityException, IllegalRequestException, ExplodingClusterFuckException, ContentNotFoundException {
		Long id = request.getLong("id");
		String text = request.getString("text");
		if (Strings.isNotBlank(text)) {
			text = text.trim();
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
		readerIndexer.reIndex(privileged);
	}
	
	@Path
	public StatementEditPerspective loadStatement(Request request) throws ModelException, IllegalRequestException {
		Long id = request.getLong("id");
		if (id==null) {
			throw new IllegalRequestException("No id");
		}
		UserSession session = request.getSession();
		@Nullable
		Statement statement = modelService.get(Statement.class, id, session);
		if (statement==null) {
			throw new IllegalRequestException("Statement not found");			
		}
		StatementEditPerspective perspective = new StatementEditPerspective();
		perspective.setText(statement.getText());
		perspective.setId(id);
		{
			List<Person> people = getAuthors(statement, session);
			perspective.setAuthors(people.stream().map((Person p) -> {
				ItemData option = new ItemData();
				option.setId(p.getId());
				option.setText(p.getFullName());
				option.setIcon(p.getIcon());
				return option;
			}).collect(Collectors.toList()));
		}
		List<Question> questions = modelService.list(Query.after(Question.class).from(statement,Relation.ANSWERS).withPrivileged(session));
		perspective.setQuestions(questions.stream().map((Question q) -> {
			ItemData option = new ItemData();
			option.setId(q.getId());
			option.setText(q.getText());
			option.setIcon(q.getIcon());
			return option;
		}).collect(Collectors.toList()));

		Function<Hypothesis, ? extends ItemData> hypothesisMapper = (Hypothesis q) -> {
			ItemData option = new ItemData();
			option.setId(q.getId());
			option.setText(q.getText());
			option.setIcon(q.getIcon());
			return option;
		};
		
		List<Hypothesis> supports = modelService.list(Query.after(Hypothesis.class).from(statement,Relation.SUPPORTS).withPrivileged(session));
		perspective.setSupports(supports.stream().map(hypothesisMapper).collect(Collectors.toList()));
		
		List<Hypothesis> contradicts = modelService.list(Query.after(Hypothesis.class).from(statement,Relation.CONTRADTICS).withPrivileged(session));
		perspective.setContradicts(contradicts.stream().map(hypothesisMapper).collect(Collectors.toList()));
		
		return perspective;
	}

	private List<Person> getAuthors(Entity entity, Privileged privileged) {
		Query<Person> query = Query.of(Person.class).from(entity,Relation.KIND_COMMON_AUTHOR).withPrivileged(privileged);
		List<Person> people = modelService.list(query);
		return people;
	}
	
	@Path
	public void saveAddress(Request request) throws ModelException, IllegalRequestException, SecurityException {
		AddressEditPerspective perspective = request.getObject("data", AddressEditPerspective.class);
		AddressEditPerspective.validate(perspective);
		UserSession privileged = request.getSession();
		InternetAddress internetAddress = modelService.get(InternetAddress.class, perspective.getId(), privileged);
		if (internetAddress==null) {
			throw new IllegalRequestException("The address was not found");
		}
		internetAddress.setName(perspective.getTitle());
		boolean addressChanged = !Strings.equals(perspective.getAddress(), internetAddress.getAddress());
		internetAddress.setAddress(perspective.getAddress());
		
		modelService.updateItem(internetAddress, privileged);
		
		Collection<Long> ids = ItemData.getIds(perspective.getAuthors());
		modelService.syncRelationsFrom(internetAddress, Relation.KIND_COMMON_AUTHOR, Person.class, ids , privileged);
		
		if (addressChanged) {
			File itemFolder = storageService.getItemFolder(internetAddress.getId());
			File original = new File(itemFolder, "original");
			if (original.exists() && !original.delete()) {
				log.error("Unable to delete original for internetAddress=" + internetAddress.getId());
			}
		}

	}

	@Path
	public void saveStatement(Request request) throws ModelException, IllegalRequestException, SecurityException {
		StatementEditPerspective perspective = request.getObject("data", StatementEditPerspective.class);
		long id = perspective.getId();
		if (id<1) {
			throw new IllegalRequestException("No id");
		}
		String text = perspective.getText();
		if (Strings.isBlank(text)) {
			throw new IllegalRequestException("The text is empty");
		}
		Privileged privileged = request.getSession();
		Statement statement = modelService.get(Statement.class, id, privileged);
		statement.setName(StringUtils.abbreviate(text, 50));
		statement.setText(text);
		
		modelService.updateItem(statement, privileged);
		Collection<Long> ids = ItemData.getIds(perspective.getAuthors());
		modelService.syncRelationsFrom(statement, Relation.KIND_COMMON_AUTHOR, Person.class, ids , privileged);

		Collection<Long> questionIds = ItemData.getIds(perspective.getQuestions());
		modelService.syncRelationsFrom(statement, Relation.ANSWERS, Question.class, questionIds , privileged);

		Collection<Long> supportsIds = ItemData.getIds(perspective.getSupports());
		modelService.syncRelationsFrom(statement, Relation.SUPPORTS, Hypothesis.class, supportsIds , privileged);

		Collection<Long> contradictsIds = ItemData.getIds(perspective.getContradicts());
		modelService.syncRelationsFrom(statement, Relation.CONTRADTICS, Hypothesis.class, contradictsIds , privileged);
	}
	
	@Path
	public void deleteStatement(Request request) throws IllegalRequestException, ModelException, SecurityException {
		Long id = request.getLong("id");
		if (id==null) {
			throw new IllegalRequestException("No id");
		}
		@Nullable
		Statement statement = modelService.get(Statement.class, id, request.getSession());
		if (statement==null) {
			throw new IllegalRequestException("Statement not found");
		}
		modelService.deleteEntity(statement, request.getSession());
	}

	private IndexManager getIndex(Request request) {
		return indexService.getIndex("app-reader-user-" + request.getSession().getIdentity());
	}
}
