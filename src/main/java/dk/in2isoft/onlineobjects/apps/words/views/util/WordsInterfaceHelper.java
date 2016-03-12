package dk.in2isoft.onlineobjects.apps.words.views.util;

import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.words.WordsController;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.modules.language.LanguageFacetsDataProvider;
import dk.in2isoft.onlineobjects.modules.language.LanguageStatisticsDataProvider;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsInterfaceHelper implements InitializingBean {

	private LanguageFacetsDataProvider languageFacetsDataProvider;

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
		languageFacetsDataProvider.addListener(() -> {
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
		return languageFacetsDataProvider.getData().keySet().stream().distinct().map(code -> {
			Option option = new Option();
			option.setValue(code);
			option.setLabel(languageMessages.get("code",code, locale));
			return option;
		}).sorted((a,b) -> a.getLabel().compareTo(b.getLabel())).collect(Collectors.toList());
	}

	private List<Option> buildCategoryOptions(Locale locale) {
		return languageFacetsDataProvider.getData().values().stream().distinct().map(code -> {
			Option option = new Option();
			option.setValue(code);
			option.setLabel(categoryMessages.get("code",code, locale));
			return option;
		}).sorted((a,b) -> a.getLabel().compareTo(b.getLabel())).collect(Collectors.toList());
	}
	
	public void setLanguageFacetsDataProvider(LanguageFacetsDataProvider languageFacetsDataProvider) {
		this.languageFacetsDataProvider = languageFacetsDataProvider;
	}
	
	public List<Option> getLetterOptions(Locale locale) {
		return alphabeth;
	}
}
