package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;
import dk.in2isoft.onlineobjects.services.LanguageService;

public class WordsFrontView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private LanguageService languageService;
	
	private List<WordImpression> latestWords;
		
	public void afterPropertiesSet() throws Exception {
		Query<Word> query = Query.of(Word.class).withPrivileged(getRequest().getSession()).withPaging(0, 20).orderByCreated().descending();
		String index = getRequest().getString("index");
		if (StringUtils.isNotBlank(index)) {
			query.withFieldLike(Word.TEXT_FIELD, index+"%");
		}
		this.latestWords = languageService.getImpressions(query);
	}
	
	public List<WordImpression> getLatestWords() {
		return latestWords;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
}
