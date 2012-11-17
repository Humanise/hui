package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.services.LanguageService;

public class WordsFrontView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private LanguageService languageService;
	
	private List<WordListPerspective> latestWords = Lists.newArrayList();
	private int totalCount;
	
	public void afterPropertiesSet() throws Exception {
		SearchResult<WordListPerspective> result = modelService.search(new WordListPerspectiveQuery().orderByUpdated());
		totalCount = result.getTotalCount();
		latestWords = result.getList();
	}
	
	public List<WordListPerspective> getLatestWords() {
		return latestWords;
	}
	
	public int getTotalCount() {
		return totalCount;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
}
