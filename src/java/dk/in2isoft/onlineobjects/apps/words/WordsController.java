package dk.in2isoft.onlineobjects.apps.words;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.time.StopWatch;
import org.mortbay.log.Log;

import com.google.common.collect.Lists;

import dk.in2isoft.in2igui.data.Diagram;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.apps.words.importing.HTMLDocumentImporter;
import dk.in2isoft.onlineobjects.apps.words.importing.WordsImporter;
import dk.in2isoft.onlineobjects.apps.words.perspectives.WordEnrichmentPerspective;
import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;
import dk.in2isoft.onlineobjects.modules.language.WordEnrichmentQuery;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.ScriptWriter;
import dk.in2isoft.onlineobjects.ui.StylesheetWriter;
import dk.in2isoft.onlineobjects.ui.data.Option;
import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;

public class WordsController extends WordsControllerBase {
	

	@Path(expression="/style.[0-9]+.css")
	public void style(Request request) throws IOException, EndUserException {
		StylesheetWriter writer = new StylesheetWriter(request, configurationService);
		writer.write(publicStyle);
	}

	@Path(expression="/script.[0-9]+.js")
	public void script(Request request) throws IOException, EndUserException {
		ScriptWriter writer = new ScriptWriter(request, configurationService);
		writer.write(publicScript);
	}
	
	@Path(start="upload")
	public void upload(Request request) throws IOException, EndUserException {
		ImportSession session = importService.createImportSession(request.getSession());
		DataImporter importer = importService.createImporter();
		WordsImporter listener = new WordsImporter();
		session.setHandler(listener);
		importer.setListener(listener);
		importer.setSuccessResponse(session.getId());
		importer.importMultipart(this, request);
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
		session.setHandler(handler);
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
	public WordEnrichmentPerspective getNextEnrichment(Request request) throws IOException, EndUserException {
		Query<Word> query = Query.after(Word.class).withCustomProperty(Property.KEY_WORD_SUGGESTION_LANGUAGE, "da");
		query.withPaging(0, 1).orderByField("id");
		StopWatch watch = new StopWatch();
		watch.start();
		List<WordEnrichmentPerspective> list = modelService.list(new WordEnrichmentQuery());
		watch.stop();
		System.out.println(watch.toString());
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