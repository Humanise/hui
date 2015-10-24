package dk.in2isoft.onlineobjects.apps.words;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.lang.time.StopWatch;
import org.onlineobjects.common.Auditor;
import org.onlineobjects.common.VoidAuditor;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.in2igui.data.Diagram;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.apps.words.importing.HTMLDocumentImporter;
import dk.in2isoft.onlineobjects.apps.words.importing.WordsImporter;
import dk.in2isoft.onlineobjects.apps.words.perspectives.WordEnrichmentPerspective;
import dk.in2isoft.onlineobjects.apps.words.perspectives.WordsImportRequest;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;
import dk.in2isoft.onlineobjects.modules.language.WordEnrichmentQuery;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.data.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsController extends WordsControllerBase {
	
	
	@Path(start="importUpload")
	public void upload(Request request) throws IOException, EndUserException {
		ImportSession session = importService.createImportSession(request.getSession());
		DataImporter importer = importService.createImporter();
		WordsImporter listener = new WordsImporter();
		session.setTransport(listener);
		importer.setListener(listener);
		importer.setSuccessResponse(session.getId());
		importer.importMultipart(this, request);
	}
	
	@Override
	public boolean isAllowed(Request request) {
		String[] localPath = request.getLocalPath();
		if (localPath.length>1 && "index".equals(localPath[1])) {
			return !SecurityService.PUBLIC_USERNAME.equals(request.getSession().getUser().getUsername());
		}
		return super.isAllowed(request);
	}
	
	@Override
	public boolean logAccessExceptions() {
		return false;
	}
	
	@Path(start="diagram.json")
	public void getDiagram(Request request) throws ModelException, IOException {
		String text = request.getString("word");
		
		Diagram diagram = wordsModelService.getDiagram(text);
		
		request.sendObject(diagram);
	}
	
	@Path(start="startImport")
	public void startImport(Request request) throws NetworkException, IOException {
		String url = request.getString("url");
		ImportSession session = importService.createImportSession(request.getSession());
		HTMLDocumentImporter handler = new HTMLDocumentImporter(url);
		handler.setFeedService(feedService);
		handler.setHtmlService(htmlService);
		session.setTransport(handler);
		session.start();
		request.sendObject(session.getId());
	}

	@Path
	public void createWord(Request request) throws IOException, EndUserException {
		wordsModelService.createWord(request.getString("language"), request.getString("category"), request.getString("text"), request.getSession());
	}

	@Path
	public void relateWords(Request request) throws IOException, EndUserException {
		wordsModelService.relateWords(request.getLong("parentId"), request.getString("kind"), request.getLong("childId"), request.getSession());
	}

	@Path
	public void changeLanguage(Request request) throws IOException, EndUserException {
		wordsModelService.changeLanguage(request.getLong("wordId"), request.getString("language"), request.getSession());
	}

	@Path
	public void changeCategory(Request request) throws IOException, EndUserException {
		wordsModelService.changeCategory(request.getLong("wordId"), request.getString("category"), request.getSession());
	}

	@Path
	public void deleteWord(Request request) throws IOException, EndUserException {
		wordsModelService.deleteWord(request.getLong("wordId"), request.getSession());
	}

	@Path
	public void deleteRelation(Request request) throws IOException, EndUserException {
		wordsModelService.deleteRelation(request.getLong("relationId"), request.getSession());
	}
	
	@Path
	public Map<String, Object> getRelationInfo(Request request) throws EndUserException, IOException {
		Long relationid = request.getLong("relationId");
		Long wordId = request.getLong("wordId");
		Locale locale = new Locale(request.getString("language"));
		
		Relation relation = modelService.getRelation(relationid);
		Entity to = relation.getTo();
		Entity from = relation.getFrom();
		Entity word = null;
		if (to.getId()==wordId) {
			word = to;
		} else if (from.getId()==wordId) {
			word = from;
		} else {
			throw new IllegalRequestException("Word not found");
		}
		
		WordListPerspectiveQuery query = new WordListPerspectiveQuery().withWord(word);
		WordListPerspective perspective = modelService.search(query).getFirst();
		Map<String,Object> map = Maps.newHashMap();
		map.put("word", perspective);
		

		Messages msg = new Messages(this);
		Messages langMsg = new Messages(Language.class);
		Messages lexMsg = new Messages(LexicalCategory.class);
		
		HTMLWriter writer = new HTMLWriter();
		writer.startDiv();
		writer.startH1().text(perspective.getText()).endH1();
		if (perspective.getGlossary()!=null) {
			writer.startP().withClass("glossary").text(perspective.getGlossary()).endP();			
		}
		writer.startP().withClass("kind").startStrong().text(msg.get(relation.getKind(), locale)).endStrong();
		if (perspective.getLanguage()!=null) {
			writer.text(" - ").text(langMsg.get("code",perspective.getLanguage(), locale));			
		}
		if (perspective.getLexicalCategory()!=null) {
			writer.text(" - ").text(lexMsg.get("code",perspective.getLexicalCategory(), locale));			
		}
		
		writer.endP();
		writer.endDiv();
		
		map.put("rendering", writer.toString());
		map.put("id", relation.getId());
		
		return map;
	}
	
	@Path
	public String performImport(Request request) throws IOException, EndUserException {
		WordsImportRequest object = request.getObject("data", WordsImportRequest.class);
		Auditor auditor = new VoidAuditor();
		wordsModelService.importWords(object, auditor , request.getSession());
		return ""; // TODO: Too much to return
	}


	@Path
	public WordEnrichmentPerspective getNextEnrichment(Request request) throws IOException, EndUserException {
		Query<Word> query = Query.after(Word.class).withCustomProperty(Property.KEY_WORD_SUGGESTION_LANGUAGE, "da");
		query.withPaging(0, 1).orderByField("id");
		StopWatch watch = new StopWatch();
		watch.start();
		List<WordEnrichmentPerspective> list = modelService.list(new WordEnrichmentQuery());
		watch.stop();
		//System.out.println(watch.toString());
		if (!list.isEmpty()) {
			WordEnrichmentPerspective perspective = list.get(0);
			ArrayList<Option> enrichments = Lists.newArrayList();
			enrichments.add(new Option("Danish",Pair.of("language", "da")));
			enrichments.add(new Option("English",Pair.of("language", "en")));
			enrichments.add(new Option("None",Pair.of("language", null)));
			enrichments.add(new Option("Postpone",Pair.of("postpone", null)));
			perspective.setEnrichments(enrichments);
			return perspective;
		}
		return null;
	}

	@Path
	public void enrich(Request request) throws IOException, EndUserException {
		Long id = request.getLong("wordId");
		Pair<?,?> enrichment = request.getObject("enrichment", Pair.class);
		if (enrichment==null || enrichment.getKey()==null) {
			throw new IllegalRequestException("No enrichment provided");
		}
		
		UserSession session = request.getSession();
		Word word = modelService.getRequired(Word.class, id, session);
		
		if (enrichment.getKey().equals("postpone")) {
			wordsModelService.addToPostponed(word);
		}
		else if (enrichment.getKey().equals("language")) {
			String lang = enrichment.getValue()==null ? null : enrichment.getValue().toString();
			wordsModelService.changeLanguage(word, lang, session.getUser(),session);
			word.removeProperties(Property.KEY_WORD_SUGGESTION_LANGUAGE);
			modelService.updateItem(word, modelService.getUser("admin"));
		}
		
	}
}
