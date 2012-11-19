package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.apps.words.importing.TextImporter;
import dk.in2isoft.onlineobjects.core.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.SemanticService;

public class WordsImportView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private LanguageService languageService;
	private ImportService importService;
	private SemanticService semanticService;
	
	private String id;
	private Language language;
	private String status;
	private String text;
	private List<Item> uniqueWords;
	private String title;
	private List<Word> foundWords;
	private List<Pair<String, Integer>> wordFrequency;
	
	public void afterPropertiesSet() throws Exception {
		String[] path = getRequest().getLocalPath();
		if (path.length==3) {
			language = languageService.getLanguageForCode(path[0]);
			if (language == null) {
				throw new IllegalRequestException("Unsupported language");
			}
			id = path[2];
			ImportSession session = importService.getImportSession(id);
			if (session==null) {
				throw new ContentNotFoundException("The session does not exist");
			}
			status = session.getStatus().name();
			TextImporter handler = (TextImporter) session.getHandler();
			this.title = handler.getTitle();
			this.text = handler.getText();
			
			String[] allWords = semanticService.getWords(this.text);
			semanticService.lowercaseWords(allWords);
			wordFrequency = semanticService.getSortedWordFrequency(allWords);
			String[] words = semanticService.getUniqueWords(allWords);
			
			Query<Word> query = Query.after(Word.class).withFieldIn(Word.TEXT_FIELD, words);
			this.foundWords = modelService.list(query);

			this.uniqueWords = Lists.newArrayList();
			for (Pair<String, Integer> pair : wordFrequency) {
				String text = pair.getKey();
				Item item = new Item();
				item.setText(text);
				item.setCount(pair.getValue());
				
				for (Word word : this.foundWords) {
					if (text.equals(word.getText())) {
						item.setKnown(true);
						break;
					}
				}
				uniqueWords.add(item);
			}
		}
	}
	
	public static class Item {
		private String text;
		private boolean known;
		private int count;
		public void setText(String text) {
			this.text = text;
		}
		public String getText() {
			return text;
		}
		public void setKnown(boolean known) {
			this.known = known;
		}
		public boolean isKnown() {
			return known;
		}
		public void setCount(int count) {
			this.count = count;
		}
		public int getCount() {
			return count;
		}
	}
	
	public List<Pair<String, Integer>> getWordFrequency() {
		return wordFrequency;
	}
	
	public List<Word> getFoundWords() {
		return foundWords;
	}
	
	public String getTitle() {
		return title;
	}
	
	public String getId() {
		return id;
	}
		
	public Language getLanguage() {
		return language;
	}
	
	public String getStatus() {
		return status;
	}
	
	public String getText() {
		return text;
	}
	
	public List<Item> getUniqueWords() {
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
