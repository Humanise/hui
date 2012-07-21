package dk.in2isoft.onlineobjects.apps.words;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.NetworkException;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Relation;
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
			modelService.createRelation(language, word, getUserSession());
			if (lexicalCategory!=null) {
				modelService.createRelation(lexicalCategory, word, getUserSession());
			}
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
		modelService.createRelation(lexicalCategory, word, getUserSession());
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
	
	public String startUrlImport(String url) throws NetworkException {
		ImportSession session = importService.createImportSession(getUserSession());
		session.importFromUrl(url);
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
