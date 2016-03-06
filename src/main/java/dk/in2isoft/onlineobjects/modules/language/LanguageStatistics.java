package dk.in2isoft.onlineobjects.modules.language;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import com.google.common.collect.Maps;

import dk.in2isoft.onlineobjects.core.Pair;

public class LanguageStatistics {

	private Map<Locale, List<LanguageStatistic>> categoriesByLanguage;
	
	private Map<String, Integer> languages = Maps.newHashMap();

	public void setCategoriesByLanguage(Map<Locale, List<LanguageStatistic>> categoriesByLanguage) {
		this.categoriesByLanguage = categoriesByLanguage;
	}
	
	public Map<Locale, List<LanguageStatistic>> getCategoriesByLanguage() {
		return categoriesByLanguage;
	}
	
	public List<String> getLanguages() {
		return languages.entrySet().stream().map((entry) -> {
			return Pair.of(entry.getKey(), "none".equals(entry.getKey()) ? 0 : entry.getValue());
		}).sorted((a,b) -> {
			return b.getValue().compareTo(a.getValue());
		}).map((a) -> {return a.getKey();}).collect(Collectors.toList());
	}

	public void setLanguageCounts(Map<String, Integer> map) {
		languages = map;
	}
}
