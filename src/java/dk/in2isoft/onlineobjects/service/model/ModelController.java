package dk.in2isoft.onlineobjects.service.model;

import java.io.IOException;

import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.apps.words.views.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.ui.Request;

public class ModelController extends ModelControllerBase {

	
	@Path(start="listWords")
	public void listWords(Request request) throws IOException, ModelException {
		String text = request.getString("text");
		Integer page = request.getInt("page");
		if (page==null) page=0;
		ListData list = new ListData();
		list.addHeader("Word");
		list.addHeader("Language");
		list.addHeader("Category");
		WordListPerspectiveQuery query = new WordListPerspectiveQuery().withPaging(page, 50).startingWith(text);
		SearchResult<WordListPerspective> result = modelService.search(query);
		list.setWindow(result.getTotalCount(), 50, page);
		for (WordListPerspective word : result.getList()) {
			String kind = word.getClass().getSimpleName().toLowerCase();
			list.newRow(word.getId(),kind);
			list.addCell(word.getText());
			list.addCell(word.getLanguage());
			list.addCell(word.getLexicalCategory());
		}
		request.sendObject(list);
	}

	@Path(start="addWord")
	public void addWord(Request request) throws IOException, ModelException, IllegalRequestException {
		String text = request.getString("text");
		String language = request.getString("language");
		String category = request.getString("category");
		
		Word word = languageService.createWord(language, category, text, request.getSession());
		request.sendObject(word);
	}
}
