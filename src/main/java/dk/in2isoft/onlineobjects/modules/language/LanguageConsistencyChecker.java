package dk.in2isoft.onlineobjects.modules.language;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.onlineobjects.core.ConsistencyChecker;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class LanguageConsistencyChecker implements ConsistencyChecker {

	private static Logger log = Logger.getLogger(LanguageConsistencyChecker.class);

	private ModelService modelService;
	private SecurityService securityService;

	private Map<String,String> categories;
	private Map<String,String> languages;
	
	public LanguageConsistencyChecker() {
		categories = Maps.newHashMap();
		categories.put(LexicalCategory.CODE_NOMEN, "Noun");
		categories.put(LexicalCategory.CODE_PROPRIUM, "Proper noun");
		categories.put(LexicalCategory.CODE_PROPRIUM_FIRST, "First name");
		categories.put(LexicalCategory.CODE_PROPRIUM_MIDDLE, "Middle name");
		categories.put(LexicalCategory.CODE_PROPRIUM_LAST, "Last name");
		categories.put(LexicalCategory.CODE_APPELLATIV, "Common noun");
		categories.put(LexicalCategory.CODE_VERBUM, "Verb");
		categories.put(LexicalCategory.CODE_PRONOMEN, "Pronoun");
		categories.put(LexicalCategory.CODE_ADJECTIVUM, "Adjective");
		categories.put(LexicalCategory.CODE_ADVERBIUM, "Adverb");
		categories.put(LexicalCategory.CODE_PRAEPOSITION, "Preposition");
		categories.put(LexicalCategory.CODE_CONJUNCTION, "Conjunction");
		categories.put(LexicalCategory.CODE_INTERJECTION, "Interjection");
		categories.put(LexicalCategory.CODE_ARTICULUS, "Determiner");
		categories.put(LexicalCategory.CODE_NUMERUS, "Numeral");
		categories.put(LexicalCategory.CODE_ONOMATOPOEIA, "Sound word");

		languages = Maps.newHashMap();
		languages.put(Language.ENGLISH, "English");
		languages.put(Language.DANISH, "Dansk");
		languages.put("de", "Deutch");
		languages.put("fr", "Fran\u00E7ais");
		languages.put("es", "Espa\u00F1ol");
		languages.put("sv", "Svenska");
		languages.put("no", "Norsk");
		languages.put("nb", "Norsk bokm\u00E5l");
		languages.put("nn", "Norsk nynorsk");
		languages.put("is", "\u00cdslenska");
		languages.put("fo", "f\u00F8royskt");
		languages.put("fi", "Suomi");
		languages.put("kl", "Kalaallisut");
		languages.put("ar", "\u0627\u0644\u0639\u0631\u0628\u064a\u0629");
		languages.put("zh", "\u4E2D\u56FD\u7684");
		languages.put("hi", "\u0939\u093f\u0928\u094d\u0926\u0940");
		languages.put("la", "Latine");
	}
	
	@Override
	public void check() throws ModelException, SecurityException {
		User adminUser = modelService.getUser(SecurityService.ADMIN_USERNAME);
		
		for (Entry<String, String> entry : languages.entrySet()) {
			Query<Language> query = Query.of(Language.class).withField(Language.CODE, entry.getKey());
			SearchResult<Language> result = modelService.search(query);
			if (result.getTotalCount()==0) {
				log.warn("No language ("+entry.getValue()+"), creating it...");
				Language language = new Language();
				language.setCode(entry.getKey());
				language.setName(entry.getValue());
				modelService.createItem(language, adminUser);
				log.info("Language ("+entry.getValue()+") created!");
				securityService.grantPublicPrivileges(language, true, false, false);
				modelService.commit();
			} else {
				for (Language item : result.getList()) {
					securityService.grantPublicPrivileges(item, true, false, false);
					modelService.commit();
				}
			}
		}
		Map<String,LexicalCategory> map = Maps.newHashMap();
		
		for (Entry<String, String> entry : categories.entrySet()) {
			Query<LexicalCategory> query = Query.of(LexicalCategory.class).withField(LexicalCategory.CODE, entry.getKey());
			SearchResult<LexicalCategory> result = modelService.search(query);
			for (LexicalCategory item : result.getList()) {
				securityService.grantPublicPrivileges(item, true, false, false);
				modelService.commit(); 
			}
			if (result.getTotalCount()==0) {
				log.warn("No lexical category ("+entry.getValue()+"), creating it...");
				LexicalCategory category = new LexicalCategory();
				category.setCode(entry.getKey());
				category.setName(entry.getValue());
				modelService.createItem(category, adminUser);
				log.info("Lexical category ("+entry.getValue()+") created!");
				securityService.grantPublicPrivileges(category, true, false, false);
				modelService.commit();
				map.put(category.getCode(), category);
			} else if (result.getTotalCount()>1) {
				List<LexicalCategory> list = result.getList();
				LexicalCategory category = list.get(0);
				map.put(category.getCode(), category);
				for (int i = 1; i < list.size(); i++) {
					modelService.deleteEntity(list.get(i), adminUser);
					modelService.commit(); 
				}
			} else {
				LexicalCategory category = result.getFirst();
				map.put(category.getCode(), category);
			}
		}
		LexicalCategory noun = map.get(LexicalCategory.CODE_NOMEN);
		LexicalCategory proprium = map.get(LexicalCategory.CODE_PROPRIUM);
		LexicalCategory appellativ = map.get(LexicalCategory.CODE_PROPRIUM);		

		LexicalCategory firstName = map.get(LexicalCategory.CODE_PROPRIUM_FIRST);		
		LexicalCategory middleName = map.get(LexicalCategory.CODE_PROPRIUM_MIDDLE);	
		LexicalCategory lastName = map.get(LexicalCategory.CODE_PROPRIUM_LAST);
		
		List<Pair<LexicalCategory, LexicalCategory>> relations = Lists.newArrayList();
		relations.add(Pair.of(noun, proprium));
		relations.add(Pair.of(noun, appellativ));
		relations.add(Pair.of(proprium, firstName));
		relations.add(Pair.of(proprium, middleName));
		relations.add(Pair.of(proprium, lastName));
		
		for (Iterator<Pair<LexicalCategory, LexicalCategory>> i = relations.iterator(); i.hasNext();) {
			Pair<LexicalCategory, LexicalCategory> pair = i.next();
			LexicalCategory parent = pair.getKey();
			LexicalCategory child = pair.getValue();
			Relation relation = modelService.getRelation(parent, child, Relation.KIND_STRUCTURE_SPECIALIZATION);
			if (relation==null) {
				log.info("Creating "+parent.getName()+" > "+child.getName()+" relation");		
				modelService.createRelation(parent, child, Relation.KIND_STRUCTURE_SPECIALIZATION, adminUser);
				modelService.commit(); 				
			}
		}		
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
