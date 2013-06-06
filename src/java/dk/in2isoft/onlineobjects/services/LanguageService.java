package dk.in2isoft.onlineobjects.services;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multiset;
import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Counter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.service.language.TextAnalysis;

public class LanguageService {

	private ModelService modelService;
	
	private SecurityService securityService;
	
	private SemanticService semanticService;
	
	private Set<Locale> locales = Sets.newHashSet(new Locale("en","US"),new Locale("da","DK"));
	
	public Language getLanguageForCode(String code) {
		Query<Language> query = Query.of(Language.class).withField(Language.CODE, code);
		return modelService.search(query).getFirst();
	}
	
	public Locale getLocaleForCode(String language) {
		for (Locale locale : locales) {
			if (language.equals(locale.getLanguage())) {
				return locale;
			}
		}
		return new Locale(language);
	}

	public LexicalCategory getLexcialCategoryForCode(String code) {
		if (Strings.isBlank(code)) {
			return null;
		}
		Query<LexicalCategory> query = Query.of(LexicalCategory.class).withField(LexicalCategory.CODE, code);
		return modelService.search(query).getFirst();
	}
	
	public WordImpression getImpression(Word word) throws ModelException {
		WordImpression impression = new WordImpression();
		impression.setWord(word);
		impression.setLanguage(modelService.getParent(word, Language.class));
		impression.setLexicalCategory(modelService.getParent(word, LexicalCategory.class));
		impression.setOriginator(modelService.getChild(word, User.class));
		impression.setGlossary(word.getPropertyValue(Property.KEY_SEMANTICS_GLOSSARY));
		impression.setExamples(word.getPropertyValues(Property.KEY_SEMANTICS_EXAMPLE));
		String dataSource = word.getPropertyValue(Property.KEY_DATA_SOURCE);
		impression.setDataSource(dataSource);
		if (Strings.isNotBlank(dataSource)) {
			impression.setSourceTitle("WordNet.dk");
		}
		return impression;
	}
	
	public Counter<String> countLanguages(List<WordListPerspective> perspectives) {
		Multimap<String,String> wordsToLanguages = HashMultimap.create();
		for (WordListPerspective perspective : perspectives) {
			if (perspective.getLanguage()!=null) {
				wordsToLanguages.put(perspective.getText().toLowerCase(), perspective.getLanguage());					
			}
		}
		
		Counter<String> languageCounts = new Counter<String>();
		Set<String> set = wordsToLanguages.keySet();
		for (String word : set) {
			Collection<String> langs = wordsToLanguages.get(word);
			for (String lang : langs) {
				languageCounts.addOne(lang);
			}
		}
		return languageCounts;
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
	
	public Word createWord(String languageCode,String category,String text, UserSession session) throws ModelException, IllegalRequestException {
		if (StringUtils.isBlank(languageCode)) {
			throw new IllegalRequestException("No language provided");
		}
		if (StringUtils.isBlank(text)) {
			throw new IllegalRequestException("No text provided");
		}
		LexicalCategory lexicalCategory = null;
		if (StringUtils.isNotBlank(category)) {
			lexicalCategory = getLexcialCategoryForCode(category);
			if (lexicalCategory==null) {
				throw new IllegalRequestException("Unsupported category ("+category+")");
			}
		}
		Language language = getLanguageForCode(languageCode);
		if (language==null) {
			throw new IllegalRequestException("Unsupported language ("+languageCode+")");
		}
		Query<Word> query = Query.of(Word.class).withField(Word.TEXT_FIELD, text).withParent(language);
		if (lexicalCategory!=null) {
			query.withParent(lexicalCategory);
		}
		List<Word> list = modelService.list(query);
		if (list.size()==0) {
			Word word = new Word();
			word.setText(text);
			modelService.createItem(word, session);
			securityService.grantPublicPrivileges(word, true, true, false);
			Relation languageRelation = modelService.createRelation(language, word, session);
			securityService.grantPublicPrivileges(languageRelation, true, true, false);
			if (lexicalCategory!=null) {
				Relation categoryRelation = modelService.createRelation(lexicalCategory, word, session);
				securityService.grantPublicPrivileges(categoryRelation, true, true, false);
			}
			ensureOriginator(word, session);
			return word;
		} else {
			return list.iterator().next();
		}
	}
	
	public TextAnalysis analyse(String text) throws ModelException {
		String[] words = semanticService.getWords(text);
		
		semanticService.lowercaseWords(words);
		
		List<String> uniqueWords = Strings.asList(semanticService.getUniqueWords(words));
		
		WordListPerspectiveQuery query = new WordListPerspectiveQuery().withWords(uniqueWords);
		
		List<WordListPerspective> list = modelService.list(query);
		
		List<String> unknownWords = Lists.newArrayList();
		
		Set<String> knownWords = new HashSet<String>();
				
		Multimap<String,String> wordsByLanguage = HashMultimap.create();
		
		for (WordListPerspective perspective : list) {
			String word = perspective.getText().toLowerCase();
			knownWords.add(word);
			if (perspective.getLanguage()!=null) {
				wordsByLanguage.put(perspective.getLanguage(), word);
			}
		}
		
		Multiset<String> languages = wordsByLanguage.keys();
		String language = null;
		for (String lang : languages) {
			if (language==null || (wordsByLanguage.get(lang).size()>wordsByLanguage.get(language).size())) {
				language = lang;
			}
		}
		
		
		for (String word : uniqueWords) {
			if (!knownWords.contains(word)) {
				unknownWords.add(word);
			}
		}
		
		Locale possibleLocale = Locale.ENGLISH;
		String[] sentences = semanticService.getSentences(text, possibleLocale);
		
		TextAnalysis analysis = new TextAnalysis();
		analysis.setLanguage(language);
		analysis.setSentences(Strings.asList(sentences));
		analysis.setWordsByLanguage(wordsByLanguage.asMap());
		analysis.setUniqueWords(uniqueWords);
		analysis.setKnownWords(list);
		analysis.setUnknownWords(unknownWords);
		return analysis;
	}
	
	private void ensureOriginator(Word word, UserSession session) throws ModelException {

		User user = modelService.getChild(word, Relation.KIND_COMMON_ORIGINATOR, User.class);
		if (user==null) {
			modelService.createRelation(word, session.getUser(), Relation.KIND_COMMON_ORIGINATOR, session);
		}
	}
	
	
	// Wiring...

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
}
