package dk.in2isoft.onlineobjects.apps.reader;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.eclipse.jdt.annotation.Nullable;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.apps.reader.perspective.FeedPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.HypothesisEditPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.HypothesisViewPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.InternetAddressEditPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.InternetAddressViewPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.ListItemPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.PeekPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.QuestionEditPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.QuestionViewPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.StatementEditPerspective;
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
import dk.in2isoft.onlineobjects.modules.language.WordByInternetAddressQuery;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.modules.networking.NetworkResponse;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.data.Data;
import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;
import dk.in2isoft.onlineobjects.ui.data.ViewResult;

public class ReaderController extends ReaderControllerBase {

	private static Logger log = Logger.getLogger(ReaderController.class);

	@Path
	public ViewResult list(Request request) throws IOException, ModelException, ExplodingClusterFuckException, SecurityException {

		int page = request.getInt("page");
		int pageSize = request.getInt("pageSize");
		if (pageSize == 0) {
			pageSize = 30;
		}

		SearchResult<Entity> found = readerSearcher.search(request, page, pageSize);

		ViewResult result = new ViewResult();
		result.setTotal(found.getTotalCount());

		List<Entity> entities = found.getList();
		List<ListItemPerspective> list = Lists.newArrayList();
		for (Entity entity : entities) {

			ListItemPerspective perspective = new ListItemPerspective();
			perspective.setTitle(entity.getName());
			perspective.setType(entity.getClass().getSimpleName());
			perspective.setId(entity.getId());

			InternetAddress address = null;

			HTMLWriter writer = new HTMLWriter();
			writer.startDiv().withClass("reader_list_item");
			String title = entity.getName();
			if (Strings.isBlank(title)) {
				title = "-- empty --";
			}
			String url = null;
			UserSession session = request.getSession();
			if (entity instanceof InternetAddress) {
				writer.startH2().withClass("reader_list_title").text(title).endH2();
				perspective.setAddressId(entity.getId());
				address = (InternetAddress) entity;
				perspective.setUrl(address.getAddress());
				perspective.setAddress(Strings.simplifyURL(address.getAddress()));
				url = address.getAddress();
			} else if (entity instanceof Statement) {
				perspective.setStatementId(entity.getId());
				Statement htmlPart = (Statement) entity;
				writer.startP().withClass("reader_list_text reader_list_quote").text(htmlPart.getText()).endP();
				Query<InternetAddress> query = Query.after(InternetAddress.class).to(entity, Relation.KIND_STRUCTURE_CONTAINS).withPrivileged(session);
				InternetAddress addr = modelService.search(query).getFirst();
				if (addr != null) {
					perspective.setAddressId(addr.getId());
				}
			} else if (entity instanceof Question) {
				perspective.setQuestionId(entity.getId());
				Question question = (Question) entity;
				writer.startP().withClass("reader_list_text reader_list_question").text(question.getText()).endP();
			} else if (entity instanceof Hypothesis) {
				perspective.setHypothesisId(entity.getId());
				Hypothesis question = (Hypothesis) entity;
				writer.startP().withClass("reader_list_text reader_list_hypothesis").text(question.getText()).endP();
			}
			writeSource(entity,url, writer, session);

			List<Word> words = modelService.getChildren(entity, Word.class, session);
			if (Code.isNotEmpty(words)) {
				writer.startP().withClass("reader_list_words");
				List<Pair<Long, String>> tags = Lists.newArrayList();
				for (Iterator<Word> i = words.iterator(); i.hasNext();) {
					Word word = i.next();
					tags.add(Pair.of(word.getId(), word.getText()));
					writer.startA().withClass("reader_list_word js-reader-list-word").withData("id", word.getId()).text(word.getText()).endA();
					if (i.hasNext()) {
						writer.text(" " + Strings.MIDDLE_DOT + " ");
					}
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

	private void writeSource(Entity entity, String url, HTMLWriter writer, UserSession session) {
		List<Person> authors = readerModelService.getAuthors(entity, session);
		if (Code.isNotEmpty(authors) || url!=null) {
			boolean first = true;
			writer.startP().withClass("reader_list_source");
			if (url!=null) {
				writer.startA().withClass("reader_list_link js-reader-list-link").withHref(url).text(Strings.getSimplifiedDomain(url)).endA();
				first = false;
			}
			for (Iterator<Person> i = authors.iterator(); i.hasNext();) {
				if (!first) {
					writer.text(" " + Strings.MIDDLE_DOT + " ");
				}
				Person person = (Person) i.next();
				writer.startA().withClass("reader_list_author js-reader-list-author").withDataMap("id",person.getId()).text(person.getFullName()).endA();
				first = false;
			}
			writer.endP();
		}
	}
	
	@Path
	public PeekPerspective peek(Request request) throws ModelException, IllegalRequestException, ContentNotFoundException {
		String type = request.getString("type");
		PeekPerspective perspective = new PeekPerspective();
		HTMLWriter rendering = new HTMLWriter();
		Privileged privileged = request.getSession();
		if ("Link".equals(type)) {
			String url = request.getString("url");
			if (Strings.isBlank(url)) {
				rendering.startH2().text("Empty").endH2();				
			} else {
				InternetAddress found = modelService.getFirst(Query.after(InternetAddress.class).withField(InternetAddress.FIELD_ADDRESS, url).withPrivileged(privileged ));
				perspective.addAction("Open", "open");
				if (found!=null) {
					rendering.startH2().text(found.getName()).endH2();
					rendering.startP().text("Known page").endP();
					perspective.setId(found.getId());
					perspective.setType(InternetAddress.class.getSimpleName());
					perspective.addAction("View", "view");
				} else {
					rendering.startH2().text(Strings.simplifyURL(url)).endH2();
					rendering.startP().text("External web page").endP();
					Data data = new Data().add("url", url);
					perspective.setData(data);
					perspective.setType("Link");
					perspective.addAction("Import", "import");
				}
			}
		} else if (Statement.class.getSimpleName().equals(type)) {
			Long id = request.getId();
			Statement statement = modelService.getRequired(Statement.class, id, privileged);
			rendering.startH2().text(StringUtils.abbreviate(statement.getText(), 100)).endH2();
			rendering.startP().text(Statement.class.getSimpleName());
			List<Person> authors = readerModelService.getAuthors(statement, privileged);
			for (Person person : authors) {
				rendering.text(", ").text(person.getFullName());
			}
			rendering.endP();
			perspective.setId(statement.getId());
			perspective.setType(Statement.class.getSimpleName());
			perspective.addAction("Edit", "edit");
		} else if (Hypothesis.class.getSimpleName().equals(type)) {
			Long id = request.getId();
			Hypothesis hypothesis = modelService.getRequired(Hypothesis.class, id, privileged);
			rendering.startH2().text(StringUtils.abbreviate(hypothesis.getText(), 100)).endH2();
			rendering.startP().text(Hypothesis.class.getSimpleName());
			List<Person> authors = readerModelService.getAuthors(hypothesis, privileged);
			for (Person person : authors) {
				rendering.text(", ").text(person.getFullName());
			}
			rendering.endP();
			perspective.setId(hypothesis.getId());
			perspective.setType(Hypothesis.class.getSimpleName());
			perspective.addAction("Edit", "edit");
		} else if (Word.class.getSimpleName().equals(type)) {
			Long id = request.getId();
			WordListPerspectiveQuery query = new WordListPerspectiveQuery();
			query.withId(id);
			List<WordListPerspective> list = modelService.list(query);
			if (!list.isEmpty()) {
				WordListPerspective word = list.get(0);
				rendering.startH2().text(word.getText()).endH2();
				rendering.startP().text("Word: ").text(word.getLanguage()).text(" · ").text(word.getLexicalCategory()).text(" · ").text(word.getGlossary()).endP();
				perspective.setType(Word.class.getSimpleName());
				perspective.setId(word.getId());
				perspective.setData(Data.of("text",word.getText()));
				perspective.addAction("Remove", "remove");
				perspective.addAction("List", "list");
				perspective.addAction("Search", "search");
				perspective.addAction("View", "view");
			}
		} else {
			rendering.startH2().text("Unknown type").endH2();
		}
		perspective.setRendering(rendering.toString());
		return perspective;
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
	public void changeStatus(Request request) throws ModelException, SecurityException, IllegalRequestException {
		Long id = request.getId();
		String type = request.getString("type");
		Boolean favorite = request.getBoolean("favorite",null);
		Boolean inbox = request.getBoolean("inbox",null);
		if (inbox==null && favorite==null) {
			return;
		}

		UserSession session = request.getSession();
		Entity entity = null;
		@SuppressWarnings("unchecked")
		Set<Class<? extends Entity>> types = Sets.newHashSet(InternetAddress.class, Question.class, Statement.class, Hypothesis.class);
		for (Class<? extends Entity> cls : types) {
			if (cls.getSimpleName().equals(type)) {
				entity = modelService.get(cls, id, session);
			}
		}
		Code.checkNotNull(entity, "Item not found");

		if (favorite!=null) {
			pileService.addOrRemoveFromPile(session.getUser(), Relation.KIND_SYSTEM_USER_FAVORITES, entity, favorite);
		}
		if (inbox!=null) {
			pileService.addOrRemoveFromPile(session.getUser(), Relation.KIND_SYSTEM_USER_INBOX, entity, inbox);
		}
	}

	@Path
	public void changeFavoriteStatus(Request request) throws ModelException, SecurityException, IllegalRequestException, ContentNotFoundException {
		Long id = request.getId();
		boolean favorite = request.getBoolean("favorite");

		UserSession session = request.getSession();

		InternetAddress address = modelService.getRequired(InternetAddress.class, id, session);
		
		pileService.addOrRemoveFromPile(session.getUser(), Relation.KIND_SYSTEM_USER_FAVORITES, address, favorite);
	}

	@Path
	public void changeInboxStatus(Request request) throws ModelException, SecurityException, IllegalRequestException, ContentNotFoundException {
		Long id = request.getId();
		boolean inbox = request.getBoolean("inbox");

		UserSession session = request.getSession();

		InternetAddress address = modelService.getRequired(InternetAddress.class, id, session);
		pileService.addOrRemoveFromPile(session.getUser(), Relation.KIND_SYSTEM_USER_INBOX, address, inbox);
	}

	@Path
	public InternetAddressViewPerspective loadArticle(Request request) throws IOException, ModelException, SecurityException, IllegalRequestException, ExplodingClusterFuckException,
			ContentNotFoundException {
		Long articleId = request.getId();
		boolean hightlight = request.getBoolean("highlight");
		String algorithm = request.getString("algorithm");
		UserSession session = request.getSession();

		return internetAddressViewPerspectiveBuilder.build(articleId, algorithm, hightlight, session);
	}

	@Path
	public QuestionViewPerspective viewQuestion(Request request) throws ModelException, ContentNotFoundException, IllegalRequestException {
		Long id = request.getId();
		return questionViewPerspectiveBuilder.build(id, request.getSession());
	}

	@Path
	public HypothesisViewPerspective viewHypothesis(Request request) throws ModelException, ContentNotFoundException, IllegalRequestException {
		Long id = request.getId();
		return hypothesisViewPerspectiveBuilder.build(id, request.getSession());
	}

	@Path
	public void addQuote(Request request) throws IOException, ModelException, SecurityException, IllegalRequestException, ExplodingClusterFuckException, ContentNotFoundException {
		Long id = request.getId();
		String text = request.getString("text");
		if (Strings.isNotBlank(text)) {
			text = text.trim();
			if (text.length() > 10000) {
				// TODO Handle this better
				throw new IllegalRequestException("Text too long");
			}
			Privileged session = request.getSession();
			InternetAddress address = modelService.getRequired(InternetAddress.class, id, session);

			Statement part = new Statement();
			part.setName(StringUtils.abbreviate(text, 50));
			part.setText(text);
			modelService.createItem(part, session);
			modelService.createRelation(address, part, Relation.KIND_STRUCTURE_CONTAINS, session);
		}
	}

	@Path
	public void addHypothesis(Request request) throws IOException, ModelException, SecurityException, IllegalRequestException, ExplodingClusterFuckException, ContentNotFoundException {
		Long id = request.getId();
		String text = request.getString("text");
		if (Strings.isNotBlank(text)) {
			text = text.trim();
			if (text.length() > 10000) {
				// TODO Handle this better
				throw new IllegalRequestException("Text too long");
			}
			Privileged session = request.getSession();
			InternetAddress address = modelService.getRequired(InternetAddress.class, id, session);
			Hypothesis part = new Hypothesis();
			part.setName(StringUtils.abbreviate(text, 50));
			part.setText(text);
			modelService.createItem(part, session);
			modelService.createRelation(address, part, Relation.KIND_STRUCTURE_CONTAINS, session);
		}
	}

	@Path
	public void addQuestion(Request request) throws IOException, ModelException, SecurityException, IllegalRequestException, ExplodingClusterFuckException, ContentNotFoundException {
		Long id = request.getId();
		String text = request.getString("text");
		if (Strings.isNotBlank(text)) {
			text = text.trim();
			if (text.length() > 10000) {
				// TODO Handle this better
				throw new IllegalRequestException("Text too long");
			}
			Privileged session = request.getSession();
			InternetAddress address = modelService.getRequired(InternetAddress.class, id, session);
			Question part = new Question();
			part.setName(StringUtils.abbreviate(text, 50));
			part.setText(text);
			modelService.createItem(part, session);
			modelService.createRelation(address, part, Relation.KIND_STRUCTURE_CONTAINS, session);
		}
	}

	@Path
	public void addPerson(Request request) throws IOException, ModelException, SecurityException, IllegalRequestException, ExplodingClusterFuckException, ContentNotFoundException {
		Long id = request.getId();
		String text = request.getString("text");
		if (Strings.isNotBlank(text)) {
			text = text.trim();
			if (text.length() > 100) {
				// TODO Handle this better
				throw new IllegalRequestException("Text too long");
			}
			Privileged session = request.getSession();
			InternetAddress address = modelService.getRequired(InternetAddress.class, id, session);
			Person person = personService.getOrCreatePerson(text, session);
			Relation relation = modelService.getRelation(address, person, Relation.KIND_COMMON_AUTHOR);
			if (relation==null) {
				modelService.createRelation(address, person, Relation.KIND_COMMON_AUTHOR, session);				
			}
		} else {
			throw new IllegalRequestException("Text is empty");
		}
	}

	@Path
	public SimpleEntityPerspective addInternetAddress(Request request) throws ModelException, IllegalRequestException {
		String url = request.getString("url");
		if (Strings.isBlank(url)) {
			throw new IllegalRequestException("No URL");
		}

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
	public void removeInternetAddress(Request request) throws ModelException, IllegalRequestException, SecurityException, ContentNotFoundException {
		Long id = request.getId();

		Privileged privileged = request.getSession();
		InternetAddress address = modelService.getRequired(InternetAddress.class, id, privileged);

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
	public void removeTag(Request request) throws ModelException, SecurityException, IllegalRequestException, ContentNotFoundException {
		Long internetAddressId = request.getLong("internetAddressId");
		String tag = request.getString("tag");
		UserSession session = request.getSession();
		InternetAddress internetAddress = modelService.getRequired(InternetAddress.class, internetAddressId, session);
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
	public List<ItemData> getWordCloud(Request request) throws ModelException {
		WordByInternetAddressQuery query = new WordByInternetAddressQuery(request.getSession());
		/*
		 * List<ItemData> list = modelService.list(query);
		 * Collections.sort(list, (o1, o2) -> { return
		 * Strings.compareCaseless(o1.getText(),o2.getText()); });
		 */
		return modelService.list(query);
	}

	@Path
	public void reIndex(Request request) throws EndUserException {
		Privileged privileged = request.getSession();
		readerIndexer.reIndex(privileged);
	}

	@Path
	public StatementEditPerspective loadStatement(Request request) throws ModelException, IllegalRequestException, ContentNotFoundException {
		Long id = request.getId();
		UserSession session = request.getSession();
		Statement statement = modelService.getRequired(Statement.class, id, session);
		StatementEditPerspective perspective = new StatementEditPerspective();
		perspective.setText(statement.getText());
		perspective.setId(id);
		{
			List<Person> people = readerModelService.getAuthors(statement, session);
			perspective.setAuthors(people.stream().map((Person p) -> {
				ItemData option = new ItemData();
				option.setId(p.getId());
				option.setText(p.getFullName());
				option.setIcon(p.getIcon());
				return option;
			}).collect(Collectors.toList()));
		}
		List<Question> questions = modelService.list(Query.after(Question.class).from(statement, Relation.ANSWERS).withPrivileged(session));
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

		List<Hypothesis> supports = modelService.list(Query.after(Hypothesis.class).from(statement, Relation.SUPPORTS).withPrivileged(session));
		perspective.setSupports(supports.stream().map(hypothesisMapper).collect(Collectors.toList()));

		List<Hypothesis> contradicts = modelService.list(Query.after(Hypothesis.class).from(statement, Relation.CONTRADTICS).withPrivileged(session));
		perspective.setContradicts(contradicts.stream().map(hypothesisMapper).collect(Collectors.toList()));

		return perspective;
	}

	@Path
	public void saveAddress(Request request) throws ModelException, IllegalRequestException, SecurityException {
		InternetAddressEditPerspective perspective = request.getObject("data", InternetAddressEditPerspective.class);
		InternetAddressEditPerspective.validate(perspective);
		UserSession privileged = request.getSession();
		InternetAddress internetAddress = modelService.get(InternetAddress.class, perspective.getId(), privileged);
		if (internetAddress == null) {
			throw new IllegalRequestException("The address was not found");
		}
		internetAddress.setName(perspective.getTitle());
		boolean addressChanged = !Strings.equals(perspective.getAddress(), internetAddress.getAddress());
		internetAddress.setAddress(perspective.getAddress());

		modelService.updateItem(internetAddress, privileged);

		Collection<Long> ids = ItemData.getIds(perspective.getAuthors());
		modelService.syncRelationsFrom(internetAddress, Relation.KIND_COMMON_AUTHOR, Person.class, ids, privileged);

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
		if (id < 1) {
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
		modelService.syncRelationsFrom(statement, Relation.KIND_COMMON_AUTHOR, Person.class, ids, privileged);

		Collection<Long> questionIds = ItemData.getIds(perspective.getQuestions());
		modelService.syncRelationsFrom(statement, Relation.ANSWERS, Question.class, questionIds, privileged);

		Collection<Long> supportsIds = ItemData.getIds(perspective.getSupports());
		modelService.syncRelationsFrom(statement, Relation.SUPPORTS, Hypothesis.class, supportsIds, privileged);

		Collection<Long> contradictsIds = ItemData.getIds(perspective.getContradicts());
		modelService.syncRelationsFrom(statement, Relation.CONTRADTICS, Hypothesis.class, contradictsIds, privileged);
	}

	@Path
	public void deleteStatement(Request request) throws IllegalRequestException, ModelException, SecurityException {
		Long id = request.getLong("id");
		if (id == null) {
			throw new IllegalRequestException("No id");
		}
		@Nullable
		Statement statement = modelService.get(Statement.class, id, request.getSession());
		if (statement == null) {
			throw new IllegalRequestException("Statement not found");
		}
		modelService.deleteEntity(statement, request.getSession());
	}

	@Path
	public QuestionEditPerspective editQuestion(Request request) throws ModelException, IllegalRequestException, ContentNotFoundException {
		Long id = request.getId();
		return readerModelService.getQuestionEditPerspective(id, request.getSession());
	}

	@Path
	public void saveQuestion(Request request) throws ModelException, IllegalRequestException, SecurityException, ContentNotFoundException {
		QuestionEditPerspective perspective = request.getObject("data", QuestionEditPerspective.class);
		long id = perspective.getId();
		if (id < 1) {
			throw new IllegalRequestException("No id");
		}
		String text = perspective.getText();
		if (Strings.isBlank(text)) {
			throw new IllegalRequestException("The text is empty");
		}
		Privileged privileged = request.getSession();
		Question question = modelService.getRequired(Question.class, id, privileged);
		question.setName(StringUtils.abbreviate(text, 50));
		question.setText(text);

		modelService.updateItem(question, privileged);
		Collection<Long> ids = ItemData.getIds(perspective.getAuthors());
		modelService.syncRelationsFrom(question, Relation.KIND_COMMON_AUTHOR, Person.class, ids, privileged);
	}

	@Path
	public void deleteQuestion(Request request) throws IllegalRequestException, ModelException, SecurityException, ContentNotFoundException {
		Long id = request.getId();
		Question question = modelService.getRequired(Question.class, id, request.getSession());
		modelService.deleteEntity(question, request.getSession());
	}

	@Path
	public HypothesisEditPerspective editHypothesis(Request request) throws ModelException, IllegalRequestException, ContentNotFoundException {
		Long id = request.getId();
		return readerModelService.getHypothesisEditPerspective(id, request.getSession());
	}

	@Path
	public void saveHypothesis(Request request) throws ModelException, IllegalRequestException, SecurityException, ContentNotFoundException {
		HypothesisEditPerspective perspective = request.getObject("data", HypothesisEditPerspective.class);
		long id = perspective.getId();
		if (id < 1) {
			throw new IllegalRequestException("No id");
		}
		String text = perspective.getText();
		if (Strings.isBlank(text)) {
			throw new IllegalRequestException("The text is empty");
		}
		Privileged privileged = request.getSession();
		Hypothesis hypothesis = modelService.getRequired(Hypothesis.class, id, privileged);
		hypothesis.setName(StringUtils.abbreviate(text, 50));
		hypothesis.setText(text);

		modelService.updateItem(hypothesis, privileged);
		Collection<Long> ids = ItemData.getIds(perspective.getAuthors());
		modelService.syncRelationsFrom(hypothesis, Relation.KIND_COMMON_AUTHOR, Person.class, ids, privileged);
	}

	@Path
	public void deleteHypothesis(Request request) throws IllegalRequestException, ModelException, SecurityException, ContentNotFoundException {
		Long id = request.getId();
		Hypothesis question = modelService.getRequired(Hypothesis.class, id, request.getSession());
		modelService.deleteEntity(question, request.getSession());
	}
}
