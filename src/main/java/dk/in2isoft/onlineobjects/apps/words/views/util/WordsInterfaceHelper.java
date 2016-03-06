package dk.in2isoft.onlineobjects.apps.words.views.util;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.words.WordsController;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.modules.language.LanguageStatistics;
import dk.in2isoft.onlineobjects.modules.language.LanguageStatisticsDataProvider;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsInterfaceHelper implements InitializingBean {

	private LanguageStatisticsDataProvider languageStatisticsDataProvider;
	private ModelService modelService;

	private Map<String,List<Option>> languagesCache = Maps.newHashMap();
	private Map<String,List<Option>> categoriesCache = Maps.newHashMap();

	Messages languageMessages = new Messages(Language.class);
	Messages categoryMessages = new Messages(LexicalCategory.class);
	Messages wordsMessages = new Messages(WordsController.class);

	private List<Option> alphabeth;
	
	public WordsInterfaceHelper() {
		alphabeth = Lists.newArrayList();
		for (String character : Strings.ALPHABETH) {
			alphabeth.add(new Option(character, character));
		}
		alphabeth.add(new Option("other","&"));
		alphabeth.add(new Option("number","#"));
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		languageStatisticsDataProvider.addListener(() -> {
			languagesCache.clear();
			categoriesCache.clear();
		});
	}

	public List<Option> getLanguageOptions(Locale locale) {
		String language = locale.getLanguage();
		if (!languagesCache.containsKey(language)) {
			languagesCache.put(language, buildLanguageOptions(locale));
		}
		return languagesCache.get(language);
	}

	public List<Option> getCategoryOptions(Locale locale) {
		String language = locale.getLanguage();
		if (!categoriesCache.containsKey(language)) {
			categoriesCache.put(language, buildCategoryOptions(locale));
		}
		return categoriesCache.get(language);
	}
	
	private List<Option> buildLanguageOptions(Locale locale) {
		List<Option> options = Lists.newArrayList();
		LanguageStatistics data = languageStatisticsDataProvider.getData();
		
		for (String language : data.getLanguages()) {
			Option option = new Option();
			option.setValue(language);
			option.setLabel(languageMessages.get("code",language, locale));
			options.add(option);
		}
		return options;
	}

	private List<Option> buildCategoryOptions(Locale locale) {
		List<Option> options = Lists.newArrayList();
		Query<LexicalCategory> query = Query.of(LexicalCategory.class).orderByName();
		List<LexicalCategory> list = modelService.list(query);
		for (LexicalCategory item : list) {
			Option option = new Option();
			option.setValue(item.getCode());
			option.setLabel(categoryMessages.get("code",item.getCode(), locale));
			options.add(option);
		}
		{
			Option option = new Option();
			option.setValue("none");
			option.setLabel(wordsMessages.get("none", locale));
			options.add(option);			
		}
		return options;
	}

	
	public void setLanguageStatisticsDataProvider(LanguageStatisticsDataProvider languageStatisticsDataProvider) {
		this.languageStatisticsDataProvider = languageStatisticsDataProvider;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public List<Option> getLetterOptions(Locale locale) {
		return alphabeth;
	}
}
