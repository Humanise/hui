package dk.in2isoft.onlineobjects.service.language;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multiset;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
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
				
		Multimap<String,String> wordsByLanguage = HashMultimap.create();
		
		for (WordListPerspective perspective : list) {
			String word = perspective.getText().toLowerCase();
			knownWords.add(word);
			if (perspective.getLanguage()!=null) {
				wordsByLanguage.put(perspective.getLanguage(), word);
			}
		}
		
		Multiset<String> languages = wordsByLanguage.keys();
		String language = null;
		for (String lang : languages) {
			if (language==null || (wordsByLanguage.get(lang).size()>wordsByLanguage.get(language).size())) {
				language = lang;
			}
		}
		
		
		for (String word : uniqueWords) {
			if (!knownWords.contains(word)) {
				unknownWords.add(word);
			}
		}
		
		Locale possibleLocale = Locale.ENGLISH;
		String[] sentences = semanticService.getSentences(text, possibleLocale);
		
		TextAnalysis analysis = new TextAnalysis();
		analysis.setLanguage(language);
		analysis.setSentences(Strings.asList(sentences));
		analysis.setWordsByLanguage(wordsByLanguage.asMap());
		analysis.setUniqueWords(uniqueWords);
		analysis.setKnownWords(list);
		analysis.setUnknownWords(unknownWords);
		request.sendObject(analysis);
	}
}
