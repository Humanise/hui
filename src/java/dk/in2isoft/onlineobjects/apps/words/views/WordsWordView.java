package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;
import dk.in2isoft.onlineobjects.modules.language.WordImpression.WordRelation;
import dk.in2isoft.onlineobjects.modules.language.WordImpression.WordRelationGroup;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsWordView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private LanguageService languageService;
	
	private String text;
	private List<WordImpression> words;
	private Language language;
	private List<Option> categories;
	private List<Option> languages;
	private List<Option> relations;
	
	public void afterPropertiesSet() throws Exception {
		String[] path = getRequest().getLocalPath();
		if (path.length==3) {
			text = path[2].replaceAll(".html", "");
			words = languageService.getImpressions(Query.of(Word.class).withFieldLowercase(Word.TEXT_FIELD, text));
			for (WordImpression impression : words) {
				Multimap<String, WordRelation> map = HashMultimap.create();
				List<Relation> children = modelService.getChildRelations(impression.getWord(),Word.class);
				for (Relation relation : children) {
					WordRelation rel = new WordRelation();
					rel.setId(relation.getId());
					rel.setWord((Word) relation.getSubEntity());
					map.put(relation.getKind(), rel);
				}
				List<Relation> parents = modelService.getParentRelations(impression.getWord(),Word.class);
				for (Relation relation : parents) {
					WordRelation rel = new WordRelation();
					rel.setId(relation.getId());
					rel.setWord((Word) relation.getSuperEntity());
					map.put(relation.getKind(), rel);
				}
				List<WordRelationGroup> relationsList = Lists.newArrayList();
				for (String kind : map.keySet()) {
					WordRelationGroup relations = new WordRelationGroup();
					relations.setKind(kind);
					relations.setRelations(Lists.newArrayList(map.get(kind)));
					relationsList.add(relations);
				}
				impression.setRelations(relationsList);
			}
		}
	}
	
	public List<Option> getCategories() {
		if (categories!=null) return categories;
		Locale locale = getLocale();

		Messages msg = new Messages("classpath:dk/in2isoft/onlineobjects/apps/words/msg/Words");
		categories = Lists.newArrayList();

		Option unknown = new Option();
		unknown.setLabel(msg.get("unknown", locale));
		categories.add(unknown);
		
		Query<LexicalCategory> query = Query.of(LexicalCategory.class).orderByName();
		List<LexicalCategory> list = modelService.list(query);
		for (LexicalCategory category : list) {
			Option option = new Option();
			option.setValue(category.getCode());
			option.setLabel(msg.get(category.getCode(), locale));
			option.setDescription(msg.get(category.getCode()+"_description", locale));
			categories.add(option);
		}
		return categories;
	}
	
	public List<Option> getLanguages() {
		if (languages!=null) return languages;

		Messages msg = new Messages("classpath:dk/in2isoft/onlineobjects/apps/words/msg/Words");
		languages = Lists.newArrayList();
		Query<Language> query = Query.of(Language.class).orderByName();
		List<Language> list = modelService.list(query);
		Locale locale = getLocale();
		for (Language category : list) {
			Option option = new Option();
			option.setValue(category.getCode());
			option.setLabel(msg.get(category.getCode(), locale));
			languages.add(option);
		}
		return languages;
	}
	
	public List<Option> getRelations() {
		if (relations!=null) return relations;
		
		List<String> kinds = Lists.newArrayList(Relation.KIND_SEMANTICS_EQUIVALENT, Relation.KIND_SEMANTICS_SYNONYMOUS, Relation.KIND_SEMANTICS_ANTONYMOUS);

		Messages msg = new Messages("classpath:dk/in2isoft/onlineobjects/apps/words/msg/Words");
		relations = Lists.newArrayList();
		Locale locale = getLocale();
		for (String kind : kinds) {
			Option option = new Option();
			option.setValue(kind);
			option.setLabel(msg.get(kind, locale));
			relations.add(option);
		}
		return relations;
	}

	public String getText() {
		return text;
	}
	
	public List<WordImpression> getWords() {
		return words;
	}
	
	public Language getLanguage() {
		return language;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
}
