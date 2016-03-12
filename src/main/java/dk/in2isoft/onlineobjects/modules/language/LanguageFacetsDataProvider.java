package dk.in2isoft.onlineobjects.modules.language;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.caching.CachedDataProvider;

public class LanguageFacetsDataProvider extends CachedDataProvider<Multimap<String,String>> {

	private ModelService modelService;
		
	@Override
	protected Collection<Class<? extends Item>> getObservedTypes() {
		Collection<Class<? extends Item>> types = new ArrayList<>();
		types.add(Word.class);
		return types;
	}
		
	@Override
	protected Multimap<String,String> buildData() {
		Multimap<String,String> categoriesByLanguage = HashMultimap.create();
		try {
			List<WordStatistic> result = modelService.list(new WordFacetsQuery());
			for (WordStatistic statistic : result) {
				categoriesByLanguage.put(statistic.getLanguage(), statistic.getCategory());
			}
			
		} catch (ModelException e) {
			return null;
		}
		return categoriesByLanguage;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
