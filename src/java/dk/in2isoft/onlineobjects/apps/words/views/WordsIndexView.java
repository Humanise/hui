package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;

public class WordsIndexView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private LanguageService languageService;
	
	private List<WordImpression> list;
	private List<?> alphabeth;
	private int count;
	private int page;
	private String character;
	
	private int pageSize = 20;
			
	public void afterPropertiesSet() throws Exception {
		this.alphabeth = modelService.querySQL("select distinct substring(text from 1 for 1) as text from word order by text");
	}
	
	public List<WordImpression> getList() throws ModelException {
		if (this.list==null) {
			Query<Word> query = Query.of(Word.class).withPublicView().orderByField(Word.TEXT_FIELD).ascending();
			Request request = getRequest();
			String[] localPath = request.getLocalPath();
			if (localPath.length>2) {
				character = request.getLocalPath()[2];
				if (StringUtils.isNotBlank(character)) {
					query.withFieldLike(Word.TEXT_FIELD, character+"%");
				}
			}
			page = 0;
			if (localPath.length>3) {
				page = Math.max(0, NumberUtils.toInt(localPath[3])-1);
			}
			query.withPaging(page, pageSize);
			SearchResult<Word> result = modelService.search(query);
			this.list = languageService.getImpressions(result.getList());
			this.count = result.getTotalCount();
		}
		return this.list;
	}
	
	public List<Option> getPages() {
		List<Option> pages = Lists.newArrayList();
		int pageCount = (int) Math.ceil(count/pageSize);
		if (pageCount>1) {
			for (int i = 1; i <= pageCount+1; i++) {
				Option option = new Option();
				option.setValue("/"+getRequest().getLanguage()+"/index/"+character+"/"+i);
				option.setLabel(i+"");
				option.setSelected(page==i-1);
				pages.add(option);
			}
		}
		return pages;
	}
	
	public int getCount() {
		return count;
	}
	
	public String getCharacter() {
		return character;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public List<?> getAlphabeth() {
		return alphabeth;
		//return Lists.newArrayList("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","w","x","y","z");
	}
}
