package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.apps.words.views.util.WordsInterfaceHelper;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.events.AnyModelChangeListener;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;

public class WordsFrontView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private EventService eventService;
	
	private WordsInterfaceHelper wordsInterfaceHelper;
	
	private List<WordListPerspective> latestWords;
	private int totalCount;
	
	public void afterPropertiesSet() throws Exception {
		eventService.addModelEventListener(new AnyModelChangeListener(Word.class) {
			@Override
			public void itemWasChanged(Item item) {
				latestWords = null;
			}
		});
	}
	
	private void refresh() throws ModelException {
		if (latestWords==null) {
			SearchResult<WordListPerspective> result = modelService.search(new WordListPerspectiveQuery().withPaging(0, 30).orderById());
			totalCount = result.getTotalCount();
			latestWords = result.getList();
		}
	}
	
	public List<WordListPerspective> getLatestWords() throws ModelException {
		refresh();
		return latestWords;
	}
	
	public int getTotalCount() throws ModelException {
		refresh();
		return totalCount;
	}
	
	public List<Option> getAlphabeth() {
		return wordsInterfaceHelper.getLetterOptions(getLocale());
	}
	
	public List<Option> getLanguages() {
		return wordsInterfaceHelper.getLanguageOptions(getLocale());
	}
	
	public List<Option> getCategories() {
		return wordsInterfaceHelper.getCategoryOptions(getLocale());
	}
	
	// Wiring...
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setEventService(EventService eventService) {
		this.eventService = eventService;
	}
	
	public void setWordsInterfaceHelper(WordsInterfaceHelper wordsInterfaceHelper) {
		this.wordsInterfaceHelper = wordsInterfaceHelper;
	}
	
}
