package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.lang.math.NumberUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexableField;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexSearchResult;
import dk.in2isoft.onlineobjects.modules.index.IndexService;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;

public class WordsSearchView extends AbstractView implements InitializingBean {

	private static final int PAGING = 10;
	private ModelService modelService;
	private IndexService indexService;
	
	private List<WordListPerspective> list;
	private int count;
	private int page;
	private String text;
	
	private int pageSize = 20;
	private List<Option> pages;
			
	public void afterPropertiesSet() throws Exception {
		text = getRequest().getString("text");
		Request request = getRequest();
		String[] localPath = request.getLocalPath();
		page = 0;
		if (localPath.length>2) {
			page = Math.max(0, NumberUtils.toInt(localPath[2])-1);
		}
		IndexManager index = indexService.getIndex(IndexService.WORDS_INDEX);
		final List<Long> ids = Lists.newArrayList();
		SearchResult<IndexSearchResult> indexResult = index.search(text,page,20);
		if (indexResult.getTotalCount()==0) {
			return;
		}
		for (IndexSearchResult item : indexResult.getList()) {
			Document document = item.getDocument();
			IndexableField field = document.getField("id");
			ids.add(field.numericValue().longValue());
		}
		WordListPerspectiveQuery query = new WordListPerspectiveQuery().withPaging(0, 20).withIds(ids).orderByUpdated();
		SearchResult<WordListPerspective> result = modelService.search(query);
		this.list = result.getList();
		this.count = indexResult.getTotalCount();
		
		Collections.sort(this.list, new Comparator<WordListPerspective>() {

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
	}
	
	public List<WordListPerspective> getList() throws ModelException {
		return this.list;
	}
	
	public String getText() {
		return text;
	}
	
	public List<Option> getPages() {
		
		if (pages==null) {
			pages = Lists.newArrayList();
			int pageCount = (int) Math.ceil(count/pageSize)+1;
			if (pageCount>1) {
			
				int min = Math.max(1,page-PAGING);
				int max = Math.min(pageCount, page+PAGING);
				if (min>1) {
					pages.add(buildOption(1));
				}
				if (min>2) {
					pages.add(null);
				}
				for (int i = min; i <= max; i++) {
					pages.add(buildOption(i));
				}
				if (max<pageCount-1) {
					pages.add(null);
				}
				if (max<pageCount) {
					pages.add(buildOption(pageCount));
				}
			}
		}
		return pages;
	}
	
	private Option buildOption(int num) {
		Option option = new Option();
		option.setValue("/"+getRequest().getLanguage()+"/search/"+num+"/?text="+text);
		option.setLabel(num+"");
		option.setSelected(page==num-1);
		return option;
	}
	
	public int getCount() {
		return count;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setIndexService(IndexService indexService) {
		this.indexService = indexService;
	}
}
