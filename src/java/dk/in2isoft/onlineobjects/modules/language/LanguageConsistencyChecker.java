package dk.in2isoft.onlineobjects.modules.language;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;

import com.google.common.collect.Maps;

import dk.in2isoft.onlineobjects.core.ConsistencyChecker;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.User;

public class LanguageConsistencyChecker implements ConsistencyChecker {

	private static Logger log = Logger.getLogger(LanguageConsistencyChecker.class);

	private ModelService modelService;

	private Map<String,String> categories;
	private Map<String,String> languages;
	
	public LanguageConsistencyChecker() {
		categories = Maps.newHashMap();
		categories.put("nomen", "Noun");
		categories.put("verbum", "Verb");
		categories.put("pronomen", "Pronoun");
		categories.put("adjectivum", "Adjective");
		categories.put("adverbium", "Adverb");
		categories.put("praeposition", "Preposition");
		categories.put("conjunction", "Conjunction");
		categories.put("interjection", "Interjection");

		languages = Maps.newHashMap();
		languages.put("en", "English");
		languages.put("da", "Dansk");
	}
	
	public void check() throws ModelException, SecurityException {
		User adminUser = modelService.getUser(SecurityService.ADMIN_USERNAME);
		for (Entry<String, String> entry : languages.entrySet()) {
			Query<Language> query = Query.of(Language.class).withField(Language.CODE, entry.getKey());
			if (modelService.search(query).getTotalCount()==0) {
				log.warn("No language ("+entry.getValue()+"), creating it...");
				Language language = new Language();
				language.setCode(entry.getKey());
				language.setName(entry.getValue());
				modelService.createItem(language, adminUser);
				modelService.commit();
				log.info("Language ("+entry.getValue()+") created!");
			}
		}
		for (Entry<String, String> entry : categories.entrySet()) {
			Query<LexicalCategory> query = Query.of(LexicalCategory.class).withField(LexicalCategory.CODE, entry.getKey());
			SearchResult<LexicalCategory> result = modelService.search(query);
			if (result.getTotalCount()==0) {
				log.warn("No lexical category ("+entry.getValue()+"), creating it...");
				LexicalCategory language = new LexicalCategory();
				language.setCode(entry.getKey());
				language.setName(entry.getValue());
				modelService.createItem(language, adminUser);
				modelService.commit(); 
				log.info("Lexical category ("+entry.getValue()+") created!");				
			} else if (result.getTotalCount()>1) {
				List<LexicalCategory> list = result.getList();
				for (int i = 1; i < list.size(); i++) {
					modelService.deleteEntity(list.get(i), adminUser);
					modelService.commit(); 
				}
			}
		}
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
