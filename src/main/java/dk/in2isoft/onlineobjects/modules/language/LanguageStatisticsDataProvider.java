package dk.in2isoft.onlineobjects.modules.language;

import java.util.ArrayList;
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
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.caching.CachedDataProvider;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class LanguageStatisticsDataProvider extends CachedDataProvider<LanguageStatistics> {

	private ModelService modelService;
	
	private Locale[] locales = {new Locale("en"),new Locale("da")};
	
	@Override
	protected Collection<Class<? extends Item>> getObservedTypes() {
		Collection<Class<? extends Item>> types = new ArrayList<>();
		types.add(Word.class);
		return types;
	}
		
	@Override
	protected LanguageStatistics buildData() {
		LanguageStatistics statistics = new LanguageStatistics();
		try {
			Map<Locale,List<LanguageStatistic>> temp = Maps.newHashMap();
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
			statistics.setLanguageCounts(map);
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
					categories.sort((a,b)->{
						return ((Integer)b.getValue()).compareTo((Integer)a.getValue());
					});
					langStat.setCategories(categories);
				}
				languageStatistics.sort((a,b) -> {
					return b.getTotal() - a.getTotal();
				});
			}
			statistics.setCategoriesByLanguage(temp);
			
		} catch (ModelException e) {
			return null;
		}
		return statistics;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
