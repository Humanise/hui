package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.modules.language.LanguageStatistic;
import dk.in2isoft.onlineobjects.modules.language.LanguageStatisticsDataProvider;

public class WordsStatisticsView extends AbstractView {

	
	private LanguageStatisticsDataProvider statisticsDataProvider;

	public List<LanguageStatistic> getLanguages() {
		Map<Locale, List<LanguageStatistic>> data = statisticsDataProvider.getData().getCategoriesByLanguage();
		Locale locale = getLocale();
		return data.get(locale);
	}
	
	// Wiring...
	
	public void setStatisticsDataProvider(LanguageStatisticsDataProvider statisticsDataProvider) {
		this.statisticsDataProvider = statisticsDataProvider;
	}
}
