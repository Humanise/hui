package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.Collection;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.lang.time.StopWatch;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.commons.lang.Counter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.words.importing.TextImporter;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.ui.Request;

public class WordsImportView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private LanguageService languageService;
	private ImportService importService;
	private SemanticService semanticService;
	
	private String id;
	private Language language;
	private String status;
	private String text;
	private List<WordCandidate> uniqueWords;
	private String title;
	private List<Pair<String, Integer>> wordFrequency;
	private List<WordListPerspective> impressions;
	private List<Pair<String, Integer>> languages;
	private long queryTime;
	
	private Language findLanguage(String fromContent) throws IllegalRequestException {
		Request request = getRequest();
		String[] path = request.getLocalPath();
		String pathLang = path[0];
		String queryLang = request.getString("language");
		Language language = null;
		if (Strings.isNotBlank(queryLang)) {
			language = languageService.getLanguageForCode(queryLang);			
		}
		if (language==null) {
			language = languageService.getLanguageForCode(fromContent);
		}
		if (language==null) {
			language = languageService.getLanguageForCode(pathLang);
		}
		if (language == null) {
			throw new IllegalRequestException("Unsupported language");
		}
		return language;
	}
	
	public void afterPropertiesSet() throws Exception {
		String[] path = getRequest().getLocalPath();
		if (path.length==3) {
			id = path[2];
			ImportSession session = importService.getImportSession(id);
			if (session==null) {
				throw new ContentNotFoundException("The session does not exist");
			}
			status = session.getStatus().name();
			TextImporter handler = (TextImporter) session.getTransport();
			this.title = handler.getTitle();
			this.text = handler.getText();
						
			String[] allWords = semanticService.getWords(this.text);
			semanticService.lowercaseWords(allWords);
			wordFrequency = semanticService.getSortedWordFrequency(allWords);
			String[] words = semanticService.getUniqueWords(allWords);
									
			WordListPerspectiveQuery perspectiveQuery = new WordListPerspectiveQuery().withWords(words).orderByText();
			StopWatch watch = new StopWatch();
			watch.start();
			this.impressions = modelService.list(perspectiveQuery);
			watch.stop();
			this.queryTime = watch.getTime();
			
			Multimap<String,String> wordsToLanguages = HashMultimap.create();
			for (WordListPerspective perspective : impressions) {
				if (perspective.getLanguage()!=null) {
					wordsToLanguages.put(perspective.getText().toLowerCase(), perspective.getLanguage());					
				}
			}
			
			Counter<String> languageCounts = new Counter<String>();
			Set<String> set = wordsToLanguages.keySet();
			for (String word : set) {
				Collection<String> langs = wordsToLanguages.get(word);
				for (String lang : langs) {
					languageCounts.addOne(lang);
				}
			}
			language = findLanguage(languageCounts.getTop());
			
			languages = Lists.newArrayList();
			
			Set<Entry<String,Integer>> entrySet = languageCounts.getMap().entrySet();
			for (Entry<String, Integer> entry : entrySet) {
				languages.add(Pair.of(entry.getKey(), entry.getValue()));
			}
			
			
			this.uniqueWords = Lists.newArrayList();
			for (Pair<String, Integer> pair : wordFrequency) {
				String text = pair.getKey();
				WordCandidate item = new WordCandidate();
				item.setText(text);
				item.setCount(pair.getValue());
				
				for (WordListPerspective word : this.impressions) {
					if (text.equals(word.getText().toLowerCase())) {
						item.setKnown(true);
						break;
					}
				}
				Collection<String> langs = wordsToLanguages.get(text);
				item.setLanguages(Lists.newArrayList(langs));
				item.setPrimaryLanguage(langs.contains(language.getCode()));
				uniqueWords.add(item);
			}
		}
	}
	
	public List<WordListPerspective> getImpressions() {
		return impressions;
	}
	
	public List<Pair<String, Integer>> getWordFrequency() {
		return wordFrequency;
	}
		
	public String getTitle() {
		return title;
	}
	
	public String getId() {
		return id;
	}
	
	public long getQueryTime() {
		return queryTime;
	}
		
	public Language getLanguage() {
		return language;
	}
	
	public List<Pair<String, Integer>> getLanguages() {
		return languages;
	}
	
	public String getStatus() {
		return status;
	}
	
	public String getText() {
		return text;
	}
	
	public List<WordCandidate> getUniqueWords() {
		return uniqueWords;
	}
	
	// Services...

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public void setImportService(ImportService importService) {
		this.importService = importService;
	}
	
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
}
