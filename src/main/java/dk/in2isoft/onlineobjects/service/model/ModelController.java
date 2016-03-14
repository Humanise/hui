package dk.in2isoft.onlineobjects.service.model;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Predicate;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.in2igui.data.Diagram;
import dk.in2isoft.in2igui.data.FinderConfiguration;
import dk.in2isoft.in2igui.data.ListWriter;
import dk.in2isoft.in2igui.data.Node;
import dk.in2isoft.in2igui.data.FinderConfiguration.FinderCreationConfiguration;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.apps.words.WordsController;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Hypothesis;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Kind;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Question;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordQuery;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.Messages;

public class ModelController extends ModelControllerBase {

	@Path
	public void changeAccess(Request request) throws IOException, ModelException, SecurityException {
		long id = request.getLong("entityId");
		Boolean publicView = request.getBoolean("publicView",null);
		if (publicView!=null) {
			Entity entity = modelService.get(Entity.class, id, request.getSession());
			if (publicView) {
				securityService.makePublicVisible(entity,request.getSession());			
			} else {
				securityService.makePublicHidden(entity,request.getSession());
			}
		}
	}
	
	@Path(start={"image","list"})
	public void listImage(Request request) throws IOException, ModelException {
		Query<Image> query = Query.after(Image.class).withPaging(0, 40).withPrivileged(request.getSession()).orderByCreated().descending();
		SearchResult<Image> result = modelService.search(query);
		request.sendObject(result.getList());
	}
	
	@Path(start="listWords")
	public void listWords(Request request) throws IOException, ModelException, ExplodingClusterFuckException {
		String text = request.getString("text");
		int page = request.getInt("page");
		String language = request.getString("language");
		Locale locale = new Locale(language);
		
		int pageSize = 20;
		WordQuery query = new WordQuery().withPage(page).withPageSize(pageSize).withText(text);
		SearchResult<WordListPerspective> result = wordService.search(query);
		
		Messages msg = new Messages(WordsController.class);
		Messages langMsg = new Messages(Language.class);
		Messages lexMsg = new Messages(LexicalCategory.class);

		ListWriter writer = new ListWriter(request);
		writer.startList();
		writer.window(result.getTotalCount(),50,page);
		writer.startHeaders().header(msg.get("word", locale)).header(msg.get("language", locale)).header(msg.get("category", locale)).endHeaders();		
		
		for (WordListPerspective word : result.getList()) {
			String kind = word.getClass().getSimpleName().toLowerCase();
			writer.startRow().withId(word.getId()).withKind(kind);
			writer.startCell().startLine().text(word.getText()).endLine();
			if (Strings.isNotBlank(word.getGlossary())) {
				writer.startLine().minor().dimmed().text(word.getGlossary()).endLine();
			}
			writer.endCell();
			writer.startCell();
			if (Strings.isNotBlank(word.getLanguage())) {
				writer.text(langMsg.get("code."+word.getLanguage(), locale));
			}
			writer.endCell();
			writer.startCell();
			if (Strings.isNotBlank(word.getLexicalCategory())) {
				writer.text(lexMsg.get("code."+word.getLexicalCategory(),locale));
			}
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}

	@Path
	public void addTag(Request request) throws ModelException, SecurityException {
		String tag = request.getString("tag");
		Long id = request.getLong("id",null);
		if (StringUtils.isBlank(tag)) {
			return;
		}
		Entity entity = modelService.get(Entity.class, id, request.getSession());
		if (entity!=null) {
			List<String> existingTags = entity.getPropertyValues(Property.KEY_COMMON_TAG);
			if (!existingTags.contains(tag)) {
				entity.addProperty(Property.KEY_COMMON_TAG, tag);
				modelService.updateItem(entity, request.getSession());
			}
		}
	}

	@Path
	public void addWord(Request request) throws IOException, ModelException, IllegalRequestException {
		String text = request.getString("text");
		String language = request.getString("language");
		String category = request.getString("category");
		
		Word word = wordService.createWord(language, category, text, request.getSession());
		request.sendObject(word);
	}

	@Path
	public void changePrimaryEmail(Request request) throws IOException, ModelException, IllegalRequestException, SecurityException {
		String email = request.getString("email");
		memberService.changePrimaryEmail(request.getSession().getUser(),email,request.getSession());
	}
	
	@Path(start="listInbox")
	public void listInbox(Request request) throws IOException, ModelException {
		int page = request.getInt("page");
		
		User user = request.getSession().getUser();
		Pile inbox = inboxService.getOrCreateInbox(user);
		
		List<Entity> items = modelService.getChildren(inbox, Entity.class, user);

		ListWriter writer = new ListWriter(request);
		writer.startList();
		writer.window(items.size(),50,page);
		writer.startHeaders().header("Inbox").header(null, 1).endHeaders();		
		
		for (Entity item : items) {
			Map<String,String> data = Maps.newHashMap();
			
			String url = configurationService.getApplicationContext("photos", "/photo/"+item.getId()+".html", request);
			data.put("url", url);
			String kind = item.getClass().getSimpleName().toLowerCase();
			writer.startRow().withId(item.getId()).withKind(kind).withData(data);
			writer.startCell().withIcon(item.getIcon()).startLine().text(item.getName()).endLine();
			writer.endCell();
			writer.startCell().startIcon().withIcon("monochrome/delete").revealing().withAction().endIcon().endCell();
			writer.endRow();
		}
		writer.endList();
	}

	@Path
	public void removeEntity(Request request) throws IllegalRequestException, ModelException, SecurityException {

		long id = request.getLong("id");
		Entity entity = modelService.get(Entity.class, id, request.getSession());
		Code.checkNotNull(entity, "Entity not found");
		modelService.deleteEntity(entity, request.getSession());
	}

	@Path
	public void removeFromInbox(Request request) throws IllegalRequestException, ModelException, SecurityException {

		long id = request.getLong("id");
		User user = request.getSession().getUser();
		inboxService.remove(user,id);
	}
	
	@Path
	public Diagram diagram(Request request) throws IllegalRequestException, ModelException, SecurityException {
		Long id = request.getLong("id");
		Diagram diagram = new Diagram();
		
		Entity entity = modelService.get(Entity.class, id, request.getSession());
		if (entity==null) {
			throw new IllegalRequestException("Not found");
		}

		Node center = new Node();
		center.setId(id);
		center.setTitle(entity.getName());
		center.addProperty("type", entity.getClass().getSimpleName());
		diagram.addNode(center);
		
		Predicate<? super Relation> filterDissimilar = e -> {
			return Kind.similarity.toString().equals(e.getKind()) ? e.getStrength() > 0.5 : true;
		};
		modelService.getRelationsFrom(entity).stream().filter(filterDissimilar).limit(20).forEach(relation -> {
			Entity other = relation.getTo();

			Node otherNode = new Node();
			otherNode.setId(other.getId());
			otherNode.setTitle(other.getName());
			otherNode.addProperty("type", other.getClass().getSimpleName());
			diagram.addNode(otherNode);
			diagram.addEdge(center, relation.getKind(), otherNode);			
		});;

		modelService.getRelationsTo(entity).stream().filter(filterDissimilar).limit(20).forEach(relation -> {
			Entity other = relation.getFrom();

			Node otherNode = new Node();
			otherNode.setId(other.getId());
			otherNode.setTitle(other.getName());
			otherNode.addProperty("type", other.getClass().getSimpleName());
			diagram.addNode(otherNode);
			diagram.addEdge(otherNode, relation.getKind(), center);
		});
		
		return diagram;
	}

	@Path
	public FinderConfiguration finder(Request request) throws IllegalRequestException, ModelException, SecurityException {

		String type = request.getString("type");
		
		FinderConfiguration config = new FinderConfiguration();
		config.setTitle("Find " + type);
		config.setListUrl("/service/model/finderList?type=" + type);
		config.setSearchParameter("text");
		
		if (Person.class.getSimpleName().equals(type)) {
			FinderCreationConfiguration creation = config.new FinderCreationConfiguration();
			creation.setUrl("/service/model/createFromFinder?type=" + type);
			creation.setButton("New person");
			List<Object> formula = Lists.newArrayList();
			{
				Map<String,Object> field = Maps.newHashMap();
				field.put("type","TextInput");
				field.put("label","Full name");
				Map<String,Object> options = Maps.newHashMap();
				options.put("key","fullName");
				field.put("options", options);
				formula.add(field);
			}
			creation.setFormula(formula);
			config.setCreation(creation);
		}
		if (Question.class.getSimpleName().equals(type)) {
			FinderCreationConfiguration creation = config.new FinderCreationConfiguration();
			creation.setUrl("/service/model/createFromFinder?type=" + type);
			creation.setButton("New question");
			List<Object> formula = Lists.newArrayList();
			{
				Map<String,Object> field = Maps.newHashMap();
				field.put("type","TextInput");
				field.put("label","Question");
				Map<String,Object> options = Maps.newHashMap();
				options.put("key","text");
				field.put("options", options);
				formula.add(field);
			}
			creation.setFormula(formula);
			config.setCreation(creation);
		}
		if (Hypothesis.class.getSimpleName().equals(type)) {
			FinderCreationConfiguration creation = config.new FinderCreationConfiguration();
			creation.setUrl("/service/model/createFromFinder?type=" + type);
			creation.setButton("New hypothesis");
			List<Object> formula = Lists.newArrayList();
			{
				Map<String,Object> field = Maps.newHashMap();
				field.put("type","TextInput");
				field.put("label","Hypothesis");
				Map<String,Object> options = Maps.newHashMap();
				options.put("key","text");
				field.put("options", options);
				formula.add(field);
			}
			creation.setFormula(formula);
			config.setCreation(creation);
			
		}
		return config;
	}
	
	@Path
	public <E extends Entity> void finderList(Request request) throws IOException, ModelException, ExplodingClusterFuckException {
		String type = request.getString("type");
		Class<? extends Entity> entityClass = modelService.getEntityClass(type);
		
		String text = request.getString("text");
		int page = request.getInt("windowPage");
		
		Query<? extends Entity> query = Query.after(entityClass).withPaging(page, 20).withWords(text).withPrivileged(request.getSession());
		SearchResult<? extends Entity> result = modelService.search(query);


		ListWriter out = new ListWriter(request);
		out.startList();
		out.window(result.getTotalCount(),20,page);
		out.startHeaders().header("Title").endHeaders();		
		
		for (Entity entity : result.getList()) {
			String kind = entity.getClass().getSimpleName().toLowerCase();
			Map<String,Object> data = new HashMap<>();
			data.put("title", entity.getName());
			data.put("icon", entity.getIcon());
			out.startRow().withId(entity.getId()).withKind(kind).withData(data);
			out.startCell().withIcon(entity.getIcon());
			out.startLine().text(entity.getName()).endLine();
			out.endCell();
			out.endRow();
		}
		out.endList();
	}
	
	@Path
	public Object createFromFinder(Request request) throws IllegalRequestException, ModelException {
		String type = request.getString("type", "No type provided");
		if (Person.class.getSimpleName().equals(type)) {
			Person person = new Person();
			modelService.createItem(person, request.getSession());
			String name = request.getString("fullName", "No name");
			return personService.getOrCreatePerson(name, request.getSession());
		}
		if (Question.class.getSimpleName().equals(type)) {
			Question question = new Question();
			String text = request.getString("text", "No question");
			question.setText(text);
			question.setName(text);
			modelService.createItem(question, request.getSession());
			return question;
		}
		if (Hypothesis.class.getSimpleName().equals(type)) {
			Hypothesis hypothesis = new Hypothesis();
			String text = request.getString("text", "No hypothesis");
			hypothesis.setText(text);
			hypothesis.setName(text);
			modelService.createItem(hypothesis, request.getSession());
			return hypothesis;
		}
		throw new IllegalRequestException("Unknown type");
	}
}
