package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.words.WordsController;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.events.AnyModelChangeListener;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsFrontView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private EventService eventService;
	
	private List<WordListPerspective> latestWords;
	private int totalCount;
	private Map<String,List<Option>> languagesCache = Maps.newHashMap();
	private Map<String,List<Option>> categoriesCache = Maps.newHashMap();

	private static List<Option> alphabeth;
	static {
		alphabeth = Lists.newArrayList();
		for (String character : Strings.ALPHABETH) {
			alphabeth.add(new Option(character, character));
		}
		alphabeth.add(new Option("other","&"));
		alphabeth.add(new Option("number","#"));
	}
	
	public void afterPropertiesSet() throws Exception {
		eventService.addModelEventListener(new AnyModelChangeListener(Word.class) {
			@Override
			public void itemWasChanged(Item item) {
				latestWords = null;
			}
		});
		
		languagesCache.put("da", buildLanguageOptions(new Locale("da")));
		languagesCache.put("en", buildLanguageOptions(new Locale("en")));
		categoriesCache.put("da", buildCategoryOptions(new Locale("da")));
		categoriesCache.put("en", buildCategoryOptions(new Locale("en")));
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
		return alphabeth;
	}
	
	public List<Option> getLanguages() {
		return languagesCache.get(getLocale().getLanguage());
	}
	
	public List<Option> getCategories() {
		return categoriesCache.get(getLocale().getLanguage());
	}


	private List<Option> buildLanguageOptions(Locale locale) {
		List<Option> options = Lists.newArrayList();
		Messages wordsMsg = new Messages(WordsController.class);
		Messages msg = new Messages(Language.class);
		Query<Language> query = Query.of(Language.class).orderByName();
		List<Language> list = modelService.list(query);
		for (Language item : list) {
			Option option = new Option();
			option.setValue(item.getCode());
			option.setLabel(msg.get("code",item.getCode(), locale));
			options.add(option);
		}
		{
			Option option = new Option();
			option.setValue("none");
			option.setLabel(wordsMsg.get("none", locale));
			options.add(option);			
		}
		return options;
	}
	
	private List<Option> buildCategoryOptions(Locale locale) {
		List<Option> options = Lists.newArrayList();
		Messages msg = new Messages(LexicalCategory.class);
		Messages wordsMsg = new Messages(WordsController.class);
		Query<LexicalCategory> query = Query.of(LexicalCategory.class).orderByName();
		List<LexicalCategory> list = modelService.list(query);
		for (LexicalCategory item : list) {
			Option option = new Option();
			option.setValue(item.getCode());
			option.setLabel(msg.get("code",item.getCode(), locale));
			options.add(option);
		}
		{
			Option option = new Option();
			option.setValue("none");
			option.setLabel(wordsMsg.get("none", locale));
			options.add(option);			
		}
		return options;
	}
	
	// Wiring...
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setEventService(EventService eventService) {
		this.eventService = eventService;
	}
	
}
