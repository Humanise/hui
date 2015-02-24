package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.apps.words.views.util.LanguageStatistic;
import dk.in2isoft.onlineobjects.apps.words.views.util.StatisticsDataProvider;

public class WordsStatisticsView extends AbstractView {

	
	private StatisticsDataProvider statisticsDataProvider;

	public List<LanguageStatistic> getLanguages() {
		Map<Locale, List<LanguageStatistic>> data = statisticsDataProvider.getData();
		Locale locale = getLocale();
		return data.get(locale);
	}
	
	// Wiring...
	
	public void setStatisticsDataProvider(StatisticsDataProvider statisticsDataProvider) {
		this.statisticsDataProvider = statisticsDataProvider;
	}
}
