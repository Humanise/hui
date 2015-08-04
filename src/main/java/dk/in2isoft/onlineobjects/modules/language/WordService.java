package dk.in2isoft.onlineobjects.modules.language;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexableField;
import org.apache.lucene.queryparser.flexible.standard.QueryParserUtil;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexSearchResult;
import dk.in2isoft.onlineobjects.services.LanguageService;

public class WordService {
	
	private IndexManager index;
	private ModelService modelService;
	private LanguageService languageService;
	private SecurityService securityService;

	private List<String> trademarks = Lists.newArrayList("rockwool");
	
	public SearchResult<WordListPerspective> search(WordQuery query) throws ExplodingClusterFuckException, ModelException {
		final List<Long> ids = Lists.newArrayList();
		String searchQuery = buildQuery(query);
		SearchResult<IndexSearchResult> indexResult = index.search(searchQuery,query.getPage(),query.getPageSize());
		if (indexResult.getTotalCount()==0) {
			return SearchResult.empty();
		}
		for (IndexSearchResult item : indexResult.getList()) {
			Document document = item.getDocument();
			IndexableField field = document.getField("id");
			ids.add(Long.parseLong(field.stringValue()));
		}
		WordListPerspectiveQuery listQuery = new WordListPerspectiveQuery().withPaging(0, query.getPageSize()).orderByUpdated();
		if (!ids.isEmpty()) {
			listQuery.withIds(ids);
		}
		SearchResult<WordListPerspective> result = modelService.search(listQuery);
		
		Collections.sort(result.getList(), new Comparator<WordListPerspective>() {

			public int compare(WordListPerspective o1, WordListPerspective o2) {
				int index1 = ids.indexOf(o1.getId());
				int index2 = ids.indexOf(o2.getId());
				if (index1>index2) {
					return 1;
				} else if (index2>index1) {
					return -1;
				}
				return 0;
			}
		});
		result.setTotalCount(indexResult.getTotalCount());
		result.setDescription(searchQuery);
		return result;
	}
	
	private String buildQuery(WordQuery query) {

		String text = query.getText();
		String letter = query.getLetter();
		String language = query.getLanguage();
		String category = query.getCategory();
		String[] words = query.getWords();
		
		StringBuilder searchQuery = new StringBuilder();
		if (StringUtils.isNotBlank(text)) {
			String[] textWords = Strings.getWords(text);
			if (textWords.length>1) {
				searchQuery.append("word:");
				for (String word : textWords) {
					searchQuery.append(QueryParserUtil.escape(word));
				}
				searchQuery.append("^7 OR ");
				searchQuery.append("word:");
				for (String word : textWords) {
					searchQuery.append(QueryParserUtil.escape(word));
				}
				searchQuery.append("*^6 OR ");
				searchQuery.append("word:");
				for (String word : textWords) {
					searchQuery.append(QueryParserUtil.escape(word)).append("*");
				}
				searchQuery.append("^5 OR ");
			}
			for (int i = 0; i < textWords.length; i++) {
				String word = textWords[i];
				if (i > 0) {
					searchQuery.append(" AND ");
				}
				searchQuery.append("(word:").append(QueryParserUtil.escape(word)).append("^4").append(" OR word:").append(QueryParserUtil.escape(word)).append("*^4 OR ").append(QueryParserUtil.escape(word)).append("*");
				searchQuery.append(" OR word:*").append(QueryParserUtil.escape(word)).append("*");
				searchQuery.append(" OR *").append(QueryParserUtil.escape(word)).append("*");
				searchQuery.append(")");
			}
		}
		if (StringUtils.isNotBlank(letter)) {
			if (searchQuery.length()>0) {
				searchQuery.append(" AND ");
			}
			searchQuery.append("(letter:").append(QueryParserUtil.escape(letter)).append(")");
		}
				
		if (Strings.isNotBlank(language)) {
			if (searchQuery.length()>0) {
				searchQuery.append(" AND ");
			}
			searchQuery.append("language:").append(language);
		}
		if (Strings.isNotBlank(category)) {
			if (searchQuery.length()>0) {
				searchQuery.append(" AND ");
			}
			searchQuery.append("category:").append(category);
		}
		if (Strings.isDefined(words)) {
			if (searchQuery.length()>0) {
				searchQuery.append(" AND ");
			}
			searchQuery.append("(");
			for (int i = 0; i < words.length; i++) {
				if (i > 0) {
					searchQuery.append(" OR ");
				}
				searchQuery.append("word:");
				searchQuery.append("\"").append(QueryParserUtil.escape(words[i])).append("\"");
			}
			searchQuery.append(")");
		}
		return searchQuery.toString();
	}
	
	public WordImpression getImpression(Word word) throws ModelException {
		WordImpression impression = new WordImpression();
		if (trademarks.contains(word.getText().toLowerCase())) {
			impression.setTrademark(true);
		}
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
			lexicalCategory = languageService.getLexcialCategoryForCode(category);
			if (lexicalCategory==null) {
				throw new IllegalRequestException("Unsupported category ("+category+")");
			}
		}
		Language language = languageService.getLanguageForCode(languageCode);
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
			securityService.grantPublicPrivileges(word, true, false, false);
			Relation languageRelation = modelService.createRelation(language, word, session);
			securityService.grantPublicPrivileges(languageRelation, true, false, false);
			if (lexicalCategory!=null) {
				Relation categoryRelation = modelService.createRelation(lexicalCategory, word, session);
				securityService.grantPublicPrivileges(categoryRelation, true, false, false);
			}
			ensureOriginator(word, session);
			return word;
		} else {
			return list.iterator().next();
		}
	}
	
	private void ensureOriginator(Word word, UserSession session) throws ModelException {

		User user = modelService.getChild(word, Relation.KIND_COMMON_ORIGINATOR, User.class);
		if (user==null) {
			modelService.createRelation(word, session.getUser(), Relation.KIND_COMMON_ORIGINATOR, session);
		}
	}
	
	// Wiring...
	
	public void setIndex(IndexManager index) {
		this.index = index;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
