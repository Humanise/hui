package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.apache.commons.lang.time.StopWatch;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;
import com.google.common.collect.Ordering;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.words.WordsController;
import dk.in2isoft.onlineobjects.apps.words.views.util.RelationOption;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;
import dk.in2isoft.onlineobjects.modules.language.WordImpression.WordRelation;
import dk.in2isoft.onlineobjects.modules.language.WordImpression.WordRelationGroup;
import dk.in2isoft.onlineobjects.modules.language.WordRelationRow;
import dk.in2isoft.onlineobjects.modules.language.WordRelationsQuery;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsWordView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private LanguageService languageService;
	
	private String text;
	private List<WordImpression> words;
	private Language language;
	
	private List<RelationOption> relationOptions;
	private List<String> RELATIONS_BOTH_WAYS = Lists.newArrayList(Relation.KIND_SEMANTICS_EQUIVALENT, Relation.KIND_SEMANTICS_SYNONYMOUS, Relation.KIND_SEMANTICS_ANTONYMOUS);
	private List<String> RELATIONS_ONE_WAY = Lists.newArrayList(Relation.KIND_SEMANTICS_MORPHEME, Relation.KIND_SEMANTICS_GENRALTIZATION);
	
	private static final Comparator<WordRelation> ORDERING = Ordering.natural().onResultOf(relation -> relation.getWord().getText());
	
	public void afterPropertiesSet() throws Exception {
		StopWatch watch = new StopWatch();
		watch.start();
		String[] path = getRequest().getLocalPath();
		Locale locale = getRequest().getLocale();
		text = getWord(path);
		if (text!=null) {
			words = languageService.getImpressions(Query.of(Word.class).withFieldLowercase(Word.TEXT_FIELD, text));
			for (WordImpression impression : words) {
				Multimap<String, WordRelation> map = getRelationsNew(impression);
				List<WordRelationGroup> relationsList = Lists.newArrayList();
				for (String kind : map.keySet()) {
					WordRelationGroup group = new WordRelationGroup();
					group.setKind(kind);
					List<WordRelation> relations = Lists.newArrayList(map.get(kind));
					Collections.sort(relations,ORDERING);
					
					HTMLWriter html = new HTMLWriter();
					Messages msg = new Messages(WordsController.class);
					
					html.startLi().startStrong().text(msg.get(group.getKind(),locale)).text(":").endStrong().text(" ");
					int limit = 30;
					int index = 0;
					for (WordRelation relation : relations) {
						StringBuilder href = new StringBuilder("/").append(locale.getLanguage()).append("/word/").append(Strings.encodeURL(relation.getWord().getText().toLowerCase())).append(".html#").append(relation.getWord().getId()); 
						html.startA().withHref(href).withClass("words_word_relation oo_link").withData("relation",relation.getId()).withData("word",relation.getWord().getId());
						html.startSpan().text(relation.getWord().getText()).endSpan();
						html.endA();
						if (index==limit) {
							html.startSpan().withClass("words_word_relations_more");
						}
						if (index<relations.size()-1) {
							html.text(", ");
						}
						index++;
					}
					if (index>limit) {
						html.endSpan();
						html.text(" ").startA().withHref("javascript://").withClass("words_word_relations_showmore").text("More...").endA();
					}
					html.endLi();
					group.setRaw(html.toString());
					
					Collections.sort(relations, ORDERING);
					int size = 5000;
					if (relations.size()>size) {
						relations = (List<WordRelation>) relations.subList(0, size);
					}
					group.setRelations(relations);
					relationsList.add(group);
				}
				/*
				Query<InternetAddress> query = Query.after(InternetAddress.class).withChild(impression.getWord());
				List<InternetAddress> links = modelService.list(query);
				for (InternetAddress address : links) {
					System.out.println("Parent: "+address.getAddress());
				}
				
				List<Relation> parentRelations = modelService.getParentRelations(impression.getWord(), InternetAddress.class);
				for (Relation parentRelation : parentRelations) {
					System.out.println("Parent: "+parentRelation.getSuperEntity()+ " --- "+parentRelation.getKind());
				}*/
				
				
				impression.setRelations(relationsList);
			}
		}
		watch.stop();
		//System.out.println(watch.getTime()+"ms");
	}
	
	private String getWord(String[] path) {
		if (path.length > 2) {
			StringBuilder str = new StringBuilder(path[2]); 
			for (int i = 3; i < path.length; i++) {
				str.append("/").append(path[i]);
			}
			return str.toString().replaceAll(".html", "").toLowerCase();
		}
		return null;
	}

	private Multimap<String, WordRelation> getRelationsNew(WordImpression impression) throws ModelException {
		Multimap<String, WordRelation> map = HashMultimap.create();
		
		WordRelationsQuery query = new WordRelationsQuery(impression.getWord());
		List<WordRelationRow> rows = modelService.list(query);
		for (WordRelationRow row : rows) {
			WordRelation relation = new WordRelation();
			relation.setId(row.getRelationId());
			Word word = new Word();
			String kind = row.getRelationKind();
			if (row.getSuperId()==impression.getWord().getId()) {
				word.setId(row.getSubId());
				word.setText(row.getSubText());
				if (RELATIONS_ONE_WAY.contains(kind)) {
					kind = kind+".reverse";
				}
			} else {
				word.setId(row.getSuperId());
				word.setText(row.getSuperText());
			}
			relation.setWord(word);
			if (!contains(map, kind, relation)) {
				map.put(kind, relation);
			}
			
		}
		
		return map;
	}
	
	/*
	private Multimap<String, WordRelation> getRelations(WordImpression impression) throws ModelException {
		Multimap<String, WordRelation> map = HashMultimap.create();
		List<Relation> children = modelService.getChildRelations(impression.getWord(),Word.class);
		for (Relation relation : children) {
			WordRelation rel = new WordRelation();
			rel.setId(relation.getId());
			rel.setWord((Word) relation.getSubEntity());
			
			if (!contains(map, relation.getKind(), rel)) {
				if (RELATIONS_ONE_WAY.contains(relation.getKind())) {
					map.put(relation.getKind()+".reverse", rel);
				} else {
					map.put(relation.getKind(), rel);
				}
			}
		}
		List<Relation> parents = modelService.getParentRelations(impression.getWord(),Word.class);
		for (Relation relation : parents) {
			WordRelation rel = new WordRelation();
			rel.setId(relation.getId());
			rel.setWord((Word) relation.getSuperEntity());
			if (!contains(map, relation.getKind(), rel)) {
				if (RELATIONS_ONE_WAY.contains(relation.getKind())) {
					map.put(relation.getKind()+".reverse", rel);
				} else {
					map.put(relation.getKind(), rel);
				}
			}
		}
		return map;
	}*/
	
	private boolean contains(Multimap<String, WordRelation> map, String type, WordRelation relation) {
		Collection<WordRelation> collection = map.get(type);
		for (WordRelation wordRelation : collection) {
			if (wordRelation.getWord().getId()==relation.getWord().getId()) {
				return true;
			}
		}
		return false;
	}
	
	public List<RelationOption> getRelationOptions() {
		if (relationOptions!=null) return relationOptions;
		
		Messages msg = new Messages(WordsController.class);
		relationOptions = Lists.newArrayList();
		Locale locale = getLocale();
		for (String kind : RELATIONS_BOTH_WAYS) {
			RelationOption option = new RelationOption();
			option.setKind(kind);
			option.setLabel(msg.get(kind, locale));
			relationOptions.add(option);
		}
		for (String kind : RELATIONS_ONE_WAY) {
			RelationOption option = new RelationOption();
			option.setKind(kind);
			option.setLabel(msg.get(kind, locale));
			option.setReverse(true);
			relationOptions.add(option);
			
			RelationOption reverse = new RelationOption();
			reverse.setKind(kind);
			reverse.setLabel(msg.get(kind+".reverse", locale));
			relationOptions.add(reverse);
		}
		return relationOptions;
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
