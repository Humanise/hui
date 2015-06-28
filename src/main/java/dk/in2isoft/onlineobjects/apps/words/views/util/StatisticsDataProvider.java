package dk.in2isoft.onlineobjects.apps.words.views.util;

import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;

import dk.in2isoft.commons.lang.Counter;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.modules.caching.CachedDataProvider;
import dk.in2isoft.onlineobjects.modules.language.WordStatistic;
import dk.in2isoft.onlineobjects.modules.language.WordStatisticsQuery;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class StatisticsDataProvider extends CachedDataProvider<Map<Locale,List<LanguageStatistic>>> {

	private ModelService modelService;
	
	@Override
	public Map<Locale,List<LanguageStatistic>> buildData() {
		try {
			Map<Locale,List<LanguageStatistic>> temp = Maps.newHashMap();
			Locale[] locales = {new Locale("en"),new Locale("da")};
			
			Messages lexMsg = new Messages(LexicalCategory.class);
			Messages langMsg = new Messages(Language.class);
			Counter<String> counter = new Counter<String>();
			Multimap<String,WordStatistic> byLang = HashMultimap.create();
			List<WordStatistic> result = modelService.list(new WordStatisticsQuery().distinct());
			for (WordStatistic statistic : result) {
				byLang.put(statistic.getLanguage(), statistic);
				counter.add(statistic.getLanguage(),statistic.getCount());
			}
			Map<String, Integer> map = counter.getMap();
			for (Locale locale : locales) {
				List<LanguageStatistic> languageStatistics = Lists.newArrayList();
				temp.put(locale, languageStatistics);
				for (Entry<String, Integer> entry : map.entrySet()) {
					LanguageStatistic langStat = new LanguageStatistic();
					langStat.setCode(entry.getKey());
					langStat.setHeader(langMsg.get("code."+entry.getKey(),locale));
					langStat.setTotal(entry.getValue());
					languageStatistics.add(langStat);
					List<Option> categories = Lists.newArrayList();
					Collection<WordStatistic> stats = byLang.get(entry.getKey());
					for (WordStatistic statistic : stats) {
						Option option = new Option();
						option.setKey(statistic.getCategory());
						option.setLabel(lexMsg.get("code."+statistic.getCategory(), locale));
						option.setValue(statistic.getCount());
						categories.add(option);
					}
					langStat.setCategories(categories);
				}
			}
			return temp;
			
		} catch (ModelException e) {
			return null;
		}
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
