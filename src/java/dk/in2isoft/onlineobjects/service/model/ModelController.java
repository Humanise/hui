package dk.in2isoft.onlineobjects.service.model;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.in2igui.data.Diagram;
import dk.in2isoft.in2igui.data.ListWriter;
import dk.in2isoft.in2igui.data.Node;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.apps.words.WordsController;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Pile;
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
	public void addWord(Request request) throws IOException, ModelException, IllegalRequestException {
		String text = request.getString("text");
		String language = request.getString("language");
		String category = request.getString("category");
		
		Word word = languageService.createWord(language, category, text, request.getSession());
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
		String language = request.getString("language");
		
		User user = request.getSession().getUser();
		Pile inbox = inboxService.getOrCreateInbox(user);
		
		List<Image> items = modelService.getChildren(inbox, Image.class, user);

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
	public void removeFromInbox(Request request) throws IllegalRequestException, ModelException, SecurityException {

		long id = request.getLong("id");
		User user = request.getSession().getUser();
		inboxService.remove(user,id);
	}
	
	@Path
	public Diagram diagram(Request request) throws IllegalRequestException, ModelException, SecurityException {
		Long id = request.getLong("id");
		Diagram diagram = new Diagram();
		
		// TODO Security breach!
		Privileged privileged = securityService.getAdminPrivileged();
		Entity entity = modelService.get(Entity.class, id, privileged);
		if (entity==null) {
			throw new IllegalRequestException("Not found");
		}

		Node center = new Node();
		center.setId(id);
		center.setTitle(entity.getName());
		center.addProperty("type", entity.getClass().getSimpleName());
		diagram.addNode(center);
		
		List<Relation> childRelations = modelService.getChildRelations(entity);
		for (Relation relation : childRelations) {
			Entity other = relation.getSubEntity();

			Node otherNode = new Node();
			otherNode.setId(other.getId());
			otherNode.setTitle(other.getName());
			otherNode.addProperty("type", other.getClass().getSimpleName());
			diagram.addNode(otherNode);
			diagram.addEdge(center, relation.getKind(), otherNode);
		}
		
		List<Relation> parentRelations = modelService.getParentRelations(entity);
		for (Relation relation : parentRelations) {
			Entity other = relation.getSuperEntity();

			Node otherNode = new Node();
			otherNode.setId(other.getId());
			otherNode.setTitle(other.getName());
			otherNode.addProperty("type", other.getClass().getSimpleName());
			diagram.addNode(otherNode);
			diagram.addEdge(otherNode, relation.getKind(), center);
		}
		
		return diagram;
	}
}
