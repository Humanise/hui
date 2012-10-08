package dk.in2isoft.onlineobjects.services;

import java.util.List;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;

public class LanguageService {

	private ModelService modelService;
	
	public Language getLanguageForCode(String code) {
		Query<Language> query = Query.of(Language.class).withField(Language.CODE, code);
		return modelService.search(query).getFirst();
	}
	
	public LexicalCategory getLexcialCategoryForCode(String code) {
		Query<LexicalCategory> query = Query.of(LexicalCategory.class).withField(LexicalCategory.CODE, code);
		return modelService.search(query).getFirst();
	}
	
	public WordImpression getImpression(Word word) throws ModelException {
		WordImpression impression = new WordImpression();
		impression.setWord(word);
		impression.setLanguage(modelService.getParent(word, Language.class));
		impression.setLexicalCategory(modelService.getParent(word, LexicalCategory.class));
		impression.setOriginator(modelService.getChild(word, User.class));
		return impression;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public List<WordImpression> getImpressions(Query<Word> query) throws ModelException {
		return getImpressions(modelService.list(query));
	}

	public List<WordImpression> getImpressions(List<Word> list) throws ModelException {
		List<WordImpression> impressions = Lists.newArrayList();
		for (Word word : list) {
			impressions.add(getImpression(word));
		}
		return impressions;
	}
}
