package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;
import java.util.Locale;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.words.WordsController;
import dk.in2isoft.onlineobjects.apps.words.views.util.UrlBuilder;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordQuery;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsSearchView extends AbstractView implements InitializingBean {

	private static final int PAGING = 10;
	private ModelService modelService;
	private WordService wordService;
	
	private static final Logger log = LoggerFactory.getLogger(WordsSearchView.class);
	
	private List<WordListPerspective> list;
	private int count;
	private int page;
	
	private String text;
	private String letter;
	private String language;
	
	private int pageSize = 20;
	private List<Option> pages;
	
	private List<Option> languageOptions;
	private List<Option> categoryOptions;
	private List<Option> letterOptions;
	private String category;
	private String effectiveQuery;
			
	public void afterPropertiesSet() throws Exception {
		Request request = getRequest();
		text = request.getString("text");
		letter = request.getString("letter");
		language = request.getString("language");
		category = request.getString("category");
		
		String[] localPath = request.getLocalPath();
		page = 0;
		if (localPath.length>2) {
			page = Math.max(0, NumberUtils.toInt(localPath[2])-1);
		}
		
		languageOptions = buildLanguageOptions(request);
		categoryOptions = buildCategoryOptions(request);
		
		WordQuery query = new WordQuery().withText(text).withLetter(letter).withCategory(category).withLanguage(language).withPage(page).withPageSize(20);
		SearchResult<WordListPerspective> result = wordService.search(query);

		this.list = result.getList();
		this.count = result.getTotalCount();
		
		
		
		effectiveQuery = result.getDescription();
	}
	
	private List<String> categoryCodes;
	
	/** TODO: Optimize this, central cache */
	private List<String> getCategoryCodes() {
		if (categoryCodes==null) {
			Query<LexicalCategory> query = Query.of(LexicalCategory.class).orderByName();
			List<LexicalCategory> list = modelService.list(query);
			List<String> codes = Lists.newArrayList();
	
			for (LexicalCategory item : list) {
				codes.add(item.getCode());
			}
			categoryCodes = codes;
		}
		return categoryCodes;
	}
	
	private List<String> languageCodes;
	
	/** TODO: Optimize this, central cache */
	private List<String> getLanguageCodes() {
		if (languageCodes==null) {
			Query<Language> query = Query.of(Language.class).orderByName();
			List<Language> list = modelService.list(query);
			List<String> codes = Lists.newArrayList();
	
			for (Language item : list) {
				codes.add(item.getCode());
			}
			languageCodes = codes;
		}
		return languageCodes;
	}
	
	private List<Option> buildCategoryOptions(Request request) {
		List<Option> options = Lists.newArrayList();
		Messages msg = new Messages(LexicalCategory.class);
		Messages wordsMsg = new Messages(WordsController.class);
		Locale locale = getLocale();
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, language, null,letter));
			option.setLabel(wordsMsg.get("any", locale));
			option.setSelected(StringUtils.isBlank(category));
			options.add(option);			
		}
		for (String code : getCategoryCodes()) {
			Option option = new Option();
			option.setValue(buildUrl(request, text, language, code,letter));
			option.setLabel(msg.get("code",code, locale));
			option.setSelected(code.equals(category));
			options.add(option);
		}
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, language, "none",letter));
			option.setLabel(wordsMsg.get("none", locale));
			option.setSelected("none".equals(category));
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
		Messages wordsMsg = new Messages(WordsController.class);
		Messages msg = new Messages(Language.class);
		Locale locale = getLocale();
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, null, category,letter));
			option.setLabel(wordsMsg.get("any", locale));
			option.setSelected(StringUtils.isBlank(language));
			options.add(option);			
		}
		for (String code : getLanguageCodes()) {
			Option option = new Option();
			option.setValue(buildUrl(request, text, code, category,letter));
			option.setLabel(msg.get("code",code, locale));
			option.setSelected(code.equals(language));
			options.add(option);
		}
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, "none", category,letter));
			option.setLabel(wordsMsg.get("none", locale));
			option.setSelected("none".equals(language));
			options.add(option);			
		}
		return options;
	}
	
	private List<Option> buildLetterOptions(Request request) {
		List<Option> options = Lists.newArrayList();
		{
			Option option = new Option();
			option.setLabel("Any");
			option.setSelected(Strings.isBlank(letter));
			option.setValue(buildUrl(request, text, language, category, null));
			options.add(option);
		}
		for (String character : Strings.ALPHABETH) {
			Option option = new Option();
			option.setLabel(character);
			option.setSelected(character.equals(letter));
			option.setValue(buildUrl(request, text, language, category, character));
			options.add(option);
		}
		{
			Option option = new Option();
			option.setLabel("&");
			option.setSelected("other".equals(letter));
			option.setValue(buildUrl(request, text, language, category, "other"));
			options.add(option);
		}
		{
			Option option = new Option();
			option.setLabel("#");
			option.setSelected("number".equals(letter));
			option.setValue(buildUrl(request, text, language, category, "number"));
			options.add(option);
		}
		return options;
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
	
	public List<Option> getPages() {
		
		if (pages==null) {
			pages = Lists.newArrayList();
			int pageCount = (int) Math.ceil(count/pageSize)+1;
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
			}
		}
		return pages;
	}
	
	private Option buildOption(int num) {
		Option option = new Option();
		UrlBuilder url = new UrlBuilder(getRequest().getBaseContext()).folder(getRequest().getLanguage()).folder("search").folder(num);
		url.parameter("text", text).parameter("category", category).parameter("language", language).parameter("letter", letter);
		option.setValue(url.toString());
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
}
