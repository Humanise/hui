package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;
import java.util.Locale;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.words.WordsController;
import dk.in2isoft.onlineobjects.apps.words.views.util.UrlBuilder;
import dk.in2isoft.onlineobjects.apps.words.views.util.WordsInterfaceHelper;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordQuery;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.model.Filters;
import dk.in2isoft.onlineobjects.ui.jsf.model.Filters.Filter;
import dk.in2isoft.onlineobjects.ui.jsf.model.Filters.Variant;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsSearchView extends AbstractView implements InitializingBean {

	private static final int PAGING = 10;
	private ModelService modelService;
	private WordService wordService;
	private WordsInterfaceHelper wordsInterfaceHelper;
	
	//private static final Logger log = LoggerFactory.getLogger(WordsSearchView.class);
		
	private List<WordListPerspective> list;
	private int count;
	private int page;
	
	private String title;
	
	private String text;
	private String letter;
	private String language;
	private String category;
	private String source;
	
	private int pageSize = 20;
	private List<Option> pages;

	private String nextPage;
	private String previousPage;
	
	private List<Option> languageOptions;
	private List<Option> categoryOptions;
	private List<Option> letterOptions;
	private String effectiveQuery;
	private Messages wordsMsg;
	private String description;
			
	public void afterPropertiesSet() throws Exception {
		Request request = getRequest();
		text = request.getString("text");
		letter = request.getString("letter");
		language = request.getString("language");
		category = request.getString("category");
		source = request.getString("source");
		
		String[] localPath = request.getLocalPath();
		page = 0;
		if (localPath.length>2) {
			page = Math.max(0, NumberUtils.toInt(localPath[2])-1);
		}

		wordsMsg = new Messages(WordsController.class);
		languageMsg = new Messages(Language.class);
		categoryMsg = new Messages(LexicalCategory.class);
		
		languageOptions = buildLanguageOptions(request);
		categoryOptions = buildCategoryOptions(request);
		
		
		WordQuery query = new WordQuery().withText(text).withLetter(letter).withCategory(category).withLanguage(language).withSource(source).withPage(page).withPageSize(20);
		query.cached(request.getBoolean("cached"));
		SearchResult<WordListPerspective> result = wordService.search(query);

		this.list = result.getList();
		this.count = result.getTotalCount();

		highlight();
		
		effectiveQuery = result.getDescription();
		
		buildTitle();
		buildPages();
	}

	private void highlight() {
		String[] words = Strings.getWords(text);
		for (WordListPerspective row : this.list) {
			row.setHighlightedText(Strings.highlight(row.getText(), words));
			row.setHighlightedGlossary(Strings.highlight(row.getGlossary(), words));
		}
			
	}
	
	private void buildTitle() {
		Locale locale = getLocale();
		if (Strings.isBlank(language) && Strings.isBlank(category) && Strings.isBlank(letter) && Strings.isBlank(text)) {
			this.title = wordsMsg.get("searching", locale);
			return;
		}
		StringBuilder title = new StringBuilder();
		if (Strings.isNotBlank(category)) {
			title.append(categoryMsg.get("code",category+".plural", locale));
		} else {
			title.append(wordsMsg.get("any_words", locale));
		}
		if (Strings.isNotBlank(language)) {
			title.append(" ").append(wordsMsg.get("in", locale));
			title.append(" ");
			title.append(languageMsg.get("code",language, locale).toLowerCase(locale));
		}
		if (Strings.isNotBlank(letter)) {
			title.append(" ");
			title.append(wordsMsg.get("starting_with", locale));
			title.append(" ");
			if (letter.equals("other")) {
				title.append(wordsMsg.get("other_letter", locale));
			} else if (letter.equals("number")) {
				title.append(wordsMsg.get("number_letter", locale));
			} else {
				title.append(letter.toUpperCase(locale));				
			}
		}
		if (Strings.isNotBlank(text)) {
			title.append(" ");
			if (Strings.isBlank(letter)) {
				title.append(wordsMsg.get("containing", locale));
			} else {
				title.append(wordsMsg.get("and_contains", locale));
			}
			String[] words = Strings.getWords(text);
			for (int i = 0; i < words.length; i++) {
				String word = words[i];
				if (i > 0) {
					title.append(" ").append(wordsMsg.get("and", locale));					
				}
				title.append(" ");
				title.append("\"").append(word).append("\"");
			}
		}
		this.title = title.toString();
		this.description = title.toString();
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public String getDescription() {
		return this.description;
	}
	
	public boolean isClean() {
		boolean blank = Strings.isBlank(text);
		blank &= Strings.isBlank(letter);
		blank &= Strings.isBlank(language);
		blank &= Strings.isBlank(category);
		blank &= Strings.isBlank(source);
		return blank;
	}
	
	public boolean isBlank() {
		return list.isEmpty();
	}	
	
	private Messages languageMsg;
	private Messages categoryMsg;
		
	private List<Option> buildCategoryOptions(Request request) {
		List<Option> options = Lists.newArrayList();
		Locale locale = getLocale();
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, language, null,letter));
			option.setLabel(wordsMsg.get("any", locale));
			option.setKey("default");
			option.setSelected(StringUtils.isBlank(category));
			options.add(option);			
		}
		for (Option cat : wordsInterfaceHelper.getCategoryOptions(locale)) {
			Option option = new Option();
			String code = cat.getValue().toString();
			option.setValue(buildUrl(request, text, language, code,letter));
			option.setLabel(categoryMsg.get("code",code, locale));
			option.setSelected(code.equals(category));
			options.add(option);
		}
		return options;
	}
	
	private String buildUrl(Request request,String text, String language, String category, String letter) {
		UrlBuilder url = new UrlBuilder(request.getLocalContext());
		url.folder(request.getLanguage()).folder("search");
		url.parameter("category", category);
		url.parameter("language", language);
		url.parameter("text", text);
		url.parameter("letter", letter);
		return url.toString();
	}

	private List<Option> buildLanguageOptions(Request request) {
		List<Option> options = Lists.newArrayList();
		Locale locale = getLocale();
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, null, category,letter));
			option.setLabel(wordsMsg.get("any", locale));
			option.setKey("default");
			option.setSelected(StringUtils.isBlank(language));
			options.add(option);			
		}
		for (Option lang : wordsInterfaceHelper.getLanguageOptions(locale)) {
			Option option = new Option();
			String value = lang.getValue().toString();
			option.setValue(buildUrl(request, text, value, category,letter));
			option.setLabel(languageMsg.get("code",value, locale));
			option.setSelected(value.equals(language));
			options.add(option);
		}
		return options;
	}
	
	private List<Option> buildLetterOptions(Request request) {
		List<Option> options = Lists.newArrayList();
		{
			Option option = new Option();
			option.setLabel(translate("any"));
			option.setKey("default");
			option.setSelected(Strings.isBlank(letter));
			option.setValue(buildUrl(request, text, language, category, null));
			options.add(option);
		}
		List<Option> letters = wordsInterfaceHelper.getLetterOptions(getLocale());
		for (Option character : letters) {
			Option option = new Option();
			option.setLabel(character.getLabel());
			option.setSelected(character.getValue().equals(letter));
			option.setValue(buildUrl(request, text, language, category, character.getValue().toString()));
			options.add(option);
		}
		return options;
	}

	private String translate(String key) {
		return wordsMsg.get(key, getLocale());
	}
	
	public List<Option> getLetterOptions() {
		if (letterOptions==null) {
			letterOptions = buildLetterOptions(getRequest());
		}
		return letterOptions;
	}

	public List<WordListPerspective> getList() throws ModelException {
		return this.list;
	}
	
	public String getText() {
		return text;
	}
	
	public String getLanguage() {
		return language;
	}
	
	public String getCategory() {
		return category;
	}
	
	public List<Option> getLanguageOptions() {
		return languageOptions;
	}
	
	public List<Option> getCategoryOptions() {
		return categoryOptions;
	}
	
	public String getEffectiveQuery() {
		return effectiveQuery;
	}
	
	public String getLetter() {
		return letter;
	}
	
	public Filters getFilters() {
		Filters filters = new Filters();
		{
			Filter filter = new Filter(getLetterOptions());
			filter.setVariant(Variant.index);
			filter.setTitle(translate("letters"));
			if (Strings.isBlank(letter)) {
				filter.setLabel(translate("letter"));
			} else {
				filter.setActive(true);
				if ("number".equals(letter)) {
					filter.setLabel("#");
				}
				else if ("other".equals(letter)) {
					filter.setLabel("&");
				}
				else {
					filter.setLabel(letter.toUpperCase());
				}
			}
			filters.addFilter(filter);
		}
		{
			Filter filter = new Filter(getLanguageOptions());
			filter.setTitle(translate("languages"));
			if (Strings.isBlank(language)) {
				filter.setLabel(translate("language"));
			} else {
				filter.setActive(true);
				filter.setLabel(languageMsg.get("code", language, getLocale()));
			}
			filters.addFilter(filter);
		}
		{
			Filter filter = new Filter(getCategoryOptions());
			filter.setTitle(translate("categories"));
			if (Strings.isBlank(category)) {
				filter.setLabel(translate("category"));
			} else {
				filter.setActive(true);
				filter.setLabel(categoryMsg.get("code", category, getLocale()));
			}
			filters.addFilter(filter);
		}
		return filters;
	}
	
	private void buildPages() {
		pages = Lists.newArrayList();
		int pageCount = (int) Math.ceil((float)count/(float)pageSize);
		if (pageCount>1) {
			int min = Math.max(1,page-PAGING);
			int max = Math.min(pageCount, page+PAGING);
			if (min>1) {
				pages.add(buildOption(1));
			}
			if (min>2) {
				pages.add(null);
			}
			for (int i = min; i <= max; i++) {
				pages.add(buildOption(i));
			}
			if (max<pageCount-1) {
				pages.add(null);
			}
			if (max<pageCount) {
				pages.add(buildOption(pageCount));
			}
			if (page>0) {
				previousPage = buildOption(page).getValue().toString();
			}
			if (page+1<max) {
				nextPage = buildOption(page+2).getValue().toString();
			}
		}
		
	}
	
	public List<Option> getPages() {
		return pages;
	}
	
	public String getNextPage() {
		return nextPage;
	}
	
	public String getPreviousPage() {
		return previousPage;
	}
	
	private Option buildOption(int num) {
		Option option = new Option();
		UrlBuilder url = new UrlBuilder(getRequest().getBaseContext()).folder(getRequest().getLanguage()).folder("search");
		if (num>1) {
			url.folder(num);
		}
		url.parameter("text", text).parameter("category", category).parameter("language", language).parameter("letter", letter);
		option.setValue(url.toString());
		option.setKey(num==1 ? "default" : null);
		option.setLabel(num+"");
		option.setSelected(page==num-1);
		return option;
	}
	
	public int getCount() {
		return count;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setWordService(WordService wordService) {
		this.wordService = wordService;
	}
	
	public void setWordsInterfaceHelper(WordsInterfaceHelper wordsInterfaceHelper) {
		this.wordsInterfaceHelper = wordsInterfaceHelper;
	}
}
