package dk.in2isoft.onlineobjects.service.language;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.apps.words.views.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.ui.Request;

public class LanguageController extends LanguageControllerBase {

	@Path(start="analyse")
	public void analyse(Request request) throws IOException, ModelException {
		String text = request.getString("text");
		
		String[] words = semanticService.getWords(text);
		
		semanticService.lowercaseWords(words);
		
		List<String> uniqueWords = Strings.asList(semanticService.getUniqueWords(words));
		
		WordListPerspectiveQuery query = new WordListPerspectiveQuery().withWords(uniqueWords).withPaging(0, 500);
		
		List<WordListPerspective> list = modelService.list(query);
		
		List<String> unknownWords = Lists.newArrayList();
		
		Set<String> knownWords = new HashSet<String>();
		
		for (WordListPerspective perspective : list) {
			String word = perspective.getText();
			knownWords.add(word.toLowerCase());
		}
		
		for (String word : uniqueWords) {
			if (!knownWords.contains(word)) {
				unknownWords.add(word);
			}
		}
		
		Analyzation analyzation = new Analyzation();
		analyzation.setUniqueWords(uniqueWords);
		analyzation.setKnownWords(list);
		analyzation.setUnknownWords(unknownWords);
		request.sendObject(analyzation);
	}
}
