package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;
import dk.in2isoft.onlineobjects.services.LanguageService;

public class WordsWordView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private LanguageService languageService;
	
	private String text;
	private List<WordImpression> words;
	private Language language;
	
	public void afterPropertiesSet() throws Exception {
		String[] path = getRequest().getLocalPath();
		if (path.length==3) {
			text = path[2].replaceAll(".html", "");
			words = languageService.getImpressions(Query.of(Word.class).withField(Word.TEXT_FIELD, text));
		}
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
