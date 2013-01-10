package dk.in2isoft.onlineobjects.apps.words;

import java.io.IOException;

import dk.in2isoft.in2igui.data.Diagram;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.apps.words.importing.HTMLDocumentImporter;
import dk.in2isoft.onlineobjects.apps.words.importing.WordsImporter;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;
import dk.in2isoft.onlineobjects.ui.Request;

public class WordsController extends WordsControllerBase {

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
		session.setHandler(new HTMLDocumentImporter(url));
		session.start();
		
		request.sendObject(session.getId());
	}

	@Path(start="createWord")
	public void createWord(Request request) throws IOException, EndUserException {
		wordsModelService.createWord(request.getString("language"), request.getString("category"), request.getString("text"), request.getSession());
	}

	@Path(start="relateWords")
	public void relateWords(Request request) throws IOException, EndUserException {
		wordsModelService.relateWords(request.getLong("parentId"), request.getString("kind"), request.getLong("childId"), request.getSession());
	}

	@Path(start="changeLanguage")
	public void changeLanguage(Request request) throws IOException, EndUserException {
		wordsModelService.changeLanguage(request.getLong("wordId"), request.getString("language"), request.getSession());
	}

	@Path(start="changeCategory")
	public void changeCategory(Request request) throws IOException, EndUserException {
		wordsModelService.changeCategory(request.getLong("wordId"), request.getString("category"), request.getSession());
	}

	@Path(start="deleteWord")
	public void deleteWord(Request request) throws IOException, EndUserException {
		wordsModelService.deleteWord(request.getLong("wordId"), request.getSession());
	}

	@Path(start="deleteRelation")
	public void deleteRelation(Request request) throws IOException, EndUserException {
		wordsModelService.deleteRelation(request.getLong("relationId"), request.getSession());
	}
}