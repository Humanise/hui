package dk.in2isoft.onlineobjects.apps.words.views;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.SimpleWordImpression;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;
import dk.in2isoft.onlineobjects.services.LanguageService;

public class WordsFrontView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private LanguageService languageService;
	
	private List<SimpleWordImpression> latestWords = Lists.newArrayList();
	
	private static final String SQL = "select word.id, word.text, language.code as language, lexicalcategory.code as category,item.created"+
		" from word"+
		" left JOIN item on item.id=word.id "+
		
		" left outer JOIN relation as word_language on (word_language.sub_entity_id=word.id and word_language.super_entity_id in (select id from language))"+
		" left outer JOIN language on (word_language.super_entity_id=language.id)"+
		
		" left JOIN relation as word_category on (word_category.sub_entity_id=word.id and word_category.super_entity_id in (select id from lexicalcategory))"+
		" left JOIN lexicalcategory on word_category.super_entity_id=lexicalcategory.id"+
		
		" order by item.created desc limit 20";
		
	public void afterPropertiesSet() throws Exception {
		
		List<Object[]> list = modelService.querySQL(SQL);
		for (Object[] row : list) {
			SimpleWordImpression impression = new SimpleWordImpression();
			impression.setId(((BigInteger) row[0]).longValue());
			impression.setText((String) row[1]);
			impression.setLanguage((String) row[2]);
			impression.setLexicalCategory((String) row[3]);
			latestWords.add(impression);
		}
	}
	
	public List<SimpleWordImpression> getLatestWords() {
		return latestWords;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
}
