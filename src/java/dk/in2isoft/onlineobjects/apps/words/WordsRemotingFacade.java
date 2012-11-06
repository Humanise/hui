package dk.in2isoft.onlineobjects.apps.words;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.onlineobjects.apps.words.importing.HTMLDocumentImporter;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.NetworkException;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class WordsRemotingFacade extends AbstractRemotingFacade {
	
	private LanguageService languageService;
	
	private ImportService importService;
	
	private SecurityService securityService;
	
	public void createWord(String languageCode,String category,String text) throws ModelException, IllegalRequestException {
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
			modelService.createItem(word, getUserSession());
			securityService.grantPublicPrivileges(word, true, true, false);
			Relation languageRelation = modelService.createRelation(language, word, getUserSession());
			securityService.grantPublicPrivileges(languageRelation, true, true, false);
			if (lexicalCategory!=null) {
				Relation categoryRelation = modelService.createRelation(lexicalCategory, word, getUserSession());
				securityService.grantPublicPrivileges(categoryRelation, true, true, false);
			}
			ensureOriginator(word);
		}
	}
	
	public void categorizeWord(long wordId,String category) throws ModelException, IllegalRequestException {
		Word word = modelService.get(Word.class, wordId, getUserSession());
		if (word==null) {
			throw new IllegalRequestException("Word not found");
		}
		LexicalCategory lexicalCategory = languageService.getLexcialCategoryForCode(category);
		if (lexicalCategory==null) {
			throw new IllegalRequestException("Unsupported category ("+category+")");
		}
		if (modelService.getParent(word, LexicalCategory.class)!=null) {
			throw new IllegalRequestException("Word already categorized");
		}
		Relation categoryRelation = modelService.createRelation(lexicalCategory, word, getUserSession());
		securityService.grantPublicPrivileges(categoryRelation, true, true, false);
		ensureOriginator(word);
	}
	
	public void deleteWord(long wordId) throws ModelException, IllegalRequestException, SecurityException {
		Word word = modelService.get(Word.class, wordId, getUserSession());
		if (word==null) {
			throw new IllegalRequestException("Word not found");
		}
		modelService.deleteEntity(word, getUserSession());
	}
	
	public void changeWord(long wordId,String category) throws ModelException, IllegalRequestException, SecurityException {
		Word word = modelService.get(Word.class, wordId, getUserSession());
		if (word==null) {
			throw new IllegalRequestException("Word not found");
		}
		LexicalCategory lexicalCategory = languageService.getLexcialCategoryForCode(category);
		if (lexicalCategory==null) {
			throw new IllegalRequestException("Unsupported category ("+category+")");
		}
		List<Relation> parents = modelService.getParentRelations(word, LexicalCategory.class);
		modelService.deleteRelations(parents, getUserSession());
		Relation categoryRelation = modelService.createRelation(lexicalCategory, word, getUserSession());
		securityService.grantPublicPrivileges(categoryRelation, true, true, false);
		ensureOriginator(word);
	}
	
	public void changeLanguage(long wordId,String languageCode) throws ModelException, IllegalRequestException, SecurityException {
		Word word = modelService.get(Word.class, wordId, getUserSession());
		if (word==null) {
			throw new IllegalRequestException("Word not found");
		}
		Language language = languageService.getLanguageForCode(languageCode);
		if (language==null) {
			throw new IllegalRequestException("Unsupported language ("+languageCode+")");
		}
		List<Relation> parents = modelService.getParentRelations(word, Language.class);
		modelService.deleteRelations(parents, getUserSession());
		Relation relation = modelService.createRelation(language, word, getUserSession());
		securityService.grantPublicPrivileges(relation, true, true, false);
		ensureOriginator(word);
	}
	
	public Map<String,List<ItemData>> getOptions() {
		Map<String,List<ItemData>> map = Maps.newHashMap();
		List<LexicalCategory> categories = modelService.list(Query.after(LexicalCategory.class));
		List<ItemData> categoryOptions = Lists.newArrayList();
		map.put("categories", categoryOptions);
		for (LexicalCategory category : categories) {
			ItemData item = new ItemData();
			item.setValue(String.valueOf(category.getId()));
			item.setTitle(category.getName());
			categoryOptions.add(item);
		}
		List<Language> languages = modelService.list(Query.after(Language.class));
		List<ItemData> languageOptions = Lists.newArrayList();
		map.put("languages", languageOptions);
		for (Language language : languages) {
			ItemData item = new ItemData();
			item.setValue(String.valueOf(language.getId()));
			item.setTitle(language.getName());
			categoryOptions.add(item);
		}
		return map;
	}
	
	private void ensureOriginator(Word word) throws ModelException {

		User user = modelService.getChild(word, Relation.KIND_COMMON_ORIGINATOR, User.class);
		if (user==null) {
			modelService.createRelation(word, getUserSession().getUser(), Relation.KIND_COMMON_ORIGINATOR, getUserSession());
		}
	}
	
	public ListData searchWords(String text, Integer page) {
		if (page==null) page=0;
		ListData list = new ListData();
		list.addHeader("Word");
		Query<Word> query = Query.of(Word.class).withWords(text).withPaging(page, 50);
		SearchResult<Word> result = modelService.search(query);
		list.setWindow(result.getTotalCount(), 50, page);
		for (Word word : result.getList()) {
			String kind = word.getClass().getSimpleName().toLowerCase();
			list.newRow(word.getId(),kind);
			list.addCell(word.getName(), word.getIcon());
		}
		return list;
	}

	public void deleteRelation(long id) throws IllegalRequestException, SecurityException, ModelException {
		Relation relation = modelService.getRelation(id);
		if (relation==null) {
			throw new IllegalRequestException("Relation not found (id="+id+")");
		}
		modelService.deleteRelation(relation, getUserSession());
	}
	
	public void relateWords(long parentId,String kind, long childId) throws ModelException, IllegalRequestException, SecurityException {
		Word parentWord = modelService.get(Word.class, parentId, getUserSession());
		Word childWord = modelService.get(Word.class, childId, getUserSession());
		if (parentWord==null || childWord==null) {
			throw new IllegalRequestException("Word not found");
		}
		if (!Relation.KIND_SEMANTICS_EQUIVALENT.equals(kind) && !Relation.KIND_SEMANTICS_ANTONYMOUS.equals(kind) && !Relation.KIND_SEMANTICS_SYNONYMOUS.equals(kind)) {
			throw new IllegalRequestException("Illegal relation: "+kind);
		}
		
		Relation relation = modelService.getRelation(parentWord, childWord, kind);
		if (relation==null) {
			Relation newRelation = modelService.createRelation(parentWord, childWord, kind, getUserSession());
			securityService.grantPublicPrivileges(newRelation, true, true, false);
			
		}
	}
	
	public String startUrlImport(String url) throws NetworkException {
		ImportSession session = importService.createImportSession(getUserSession());
		session.setHandler(new HTMLDocumentImporter(url));
		session.start();
		return session.getId();
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public void setImportService(ImportService importService) {
		this.importService = importService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
