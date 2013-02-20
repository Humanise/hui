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
import dk.in2isoft.onlineobjects.ui.ScriptWriter;
import dk.in2isoft.onlineobjects.ui.StylesheetWriter;

public class WordsController extends WordsControllerBase {

	@Path(expression="/style.[0-9]+.css")
	public void style(Request request) throws IOException, EndUserException {
		StylesheetWriter writer = new StylesheetWriter(request, configurationService);
		
		writer.write("hui","css","button.css");
		writer.write("hui","css","searchfield.css");
		writer.write("hui","css","panel.css");
		writer.write("hui","css","boundpanel.css");
		writer.write("hui","css","window.css");
		writer.write("hui","css","list.css");
		writer.write("hui","css","formula.css");
		writer.write("hui","css","dropdown.css");
		writer.write("hui","ext","diagram.css");
		writer.write("hui","css","box.css");
		writer.write("WEB-INF","core","web","css","onlineobjects.css");
		writer.write("WEB-INF","core","web","css","common.css");
		writer.write("WEB-INF","apps","words","web","style","css","style.css");
		writer.write("WEB-INF","apps","words","web","style","css","words_sidebar.css");		
		writer.write("WEB-INF","apps","words","web","style","css","words_search.css");		
		writer.write("WEB-INF","apps","words","web","style","css","words_word.css");
		writer.write("WEB-INF","apps","words","web","style","css","words_statistics.css");		
		writer.write("WEB-INF","apps","words","web","style","css","words_layout.css");		
		writer.write("WEB-INF","apps","words","web","style","css","words_paging.css");		
		writer.write("WEB-INF","apps","words","web","style","css","words_list.css");		
		writer.write("WEB-INF","apps","words","web","style","css","words_import.css");		
	}

	@Path(expression="/script.[0-9]+.js")
	public void script(Request request) throws IOException, EndUserException {
		ScriptWriter writer = new ScriptWriter(request, configurationService);
		
		writer.write("hui","js","hui.js");
		writer.write("hui","js","hui_require.js");
		writer.write("hui","js","hui_animation.js");
		writer.write("hui","js","ui.js");
		writer.write("hui","js","SearchField.js");
		writer.write("hui","js","Button.js");
		writer.write("hui","js","BoundPanel.js");
		writer.write("hui","js","List.js");
		writer.write("hui","js","Overflow.js");
		writer.write("hui","js","Source.js");
		writer.write("hui","js","Formula.js");
		writer.write("hui","js","TextField.js");
		writer.write("hui","js","DropDown.js");
		writer.write("hui","ext","Diagram.js");
		writer.write("hui","js","Drawing.js");
		writer.write("hui","js","Window.js");
		writer.write("hui","js","Box.js");
		writer.write("WEB-INF","core","web","js","onlineobjects.js");
		writer.write("WEB-INF","apps","words","web","style","js","words.js");
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
		session.setHandler(handler);
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