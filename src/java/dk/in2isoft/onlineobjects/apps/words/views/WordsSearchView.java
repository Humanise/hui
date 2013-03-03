package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexableField;
import org.apache.lucene.queryparser.flexible.standard.QueryParserUtil;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.words.WordsController;
import dk.in2isoft.onlineobjects.apps.words.views.util.UrlBuilder;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexSearchResult;
import dk.in2isoft.onlineobjects.modules.index.IndexService;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsSearchView extends AbstractView implements InitializingBean {

	private static final int PAGING = 10;
	private ModelService modelService;
	private IndexService indexService;
	
	private List<WordListPerspective> list;
	private int count;
	private int page;
	
	private String text;
	private String language;
	
	private int pageSize = 20;
	private List<Option> pages;
	
	private List<Option> languageOptions;
	private List<Option> categoryOptions;
	private String category;
	private String effectiveQuery;
			
	public void afterPropertiesSet() throws Exception {
		Request request = getRequest();
		text = request.getString("text");
		language = request.getString("language");
		category = request.getString("category");
		
		String[] localPath = request.getLocalPath();
		page = 0;
		if (localPath.length>2) {
			page = Math.max(0, NumberUtils.toInt(localPath[2])-1);
		}
		
		languageOptions = buildLanguageOptions(request);
		categoryOptions = buildCategoryOptions(request);

		
		IndexManager index = indexService.getIndex(IndexService.WORDS_INDEX);
		final List<Long> ids = Lists.newArrayList();
		
		StringBuilder searchQuery = new StringBuilder();
		if (StringUtils.isNotBlank(text)) {
			searchQuery.append("(word:").append(QueryParserUtil.escape(text)).append("^4").append(" OR word:").append(QueryParserUtil.escape(text)).append("*^4 OR ").append(QueryParserUtil.escape(text)).append("*)");
		}
				
		if (Strings.isNotBlank(language)) {
			if (searchQuery.length()>0) {
				searchQuery.append(" AND ");
			}
			searchQuery.append("language:").append(language);
		}
		if (Strings.isNotBlank(category)) {
			if (searchQuery.length()>0) {
				searchQuery.append(" AND ");
			}
			searchQuery.append("category:").append(category);
		}
		effectiveQuery = searchQuery.toString();
		SearchResult<IndexSearchResult> indexResult = index.search(effectiveQuery,page,20);
		if (indexResult.getTotalCount()==0) {
			return;
		}
		for (IndexSearchResult item : indexResult.getList()) {
			Document document = item.getDocument();
			IndexableField field = document.getField("id");
			ids.add(field.numericValue().longValue());
		}
		WordListPerspectiveQuery query = new WordListPerspectiveQuery().withPaging(0, 20).orderByUpdated();
		if (!ids.isEmpty()) {
			query.withIds(ids);
		}
		if ("symbol".equals(request.getString("start"))) {
			query.startingWithSymbol();
		}
		if (request.isSet("language")) {
			
		}
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
	
	private List<Option> buildCategoryOptions(Request request) {
		List<Option> options = Lists.newArrayList();
		Messages msg = new Messages(LexicalCategory.class);
		Messages wordsMsg = new Messages(WordsController.class);
		Query<LexicalCategory> query = Query.of(LexicalCategory.class).orderByName();
		List<LexicalCategory> list = modelService.list(query);
		Locale locale = getLocale();
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, language, null));
			option.setLabel(wordsMsg.get("any", locale));
			option.setSelected(StringUtils.isBlank(category));
			options.add(option);			
		}
		for (LexicalCategory item : list) {
			Option option = new Option();
			option.setValue(buildUrl(request, text, language, item.getCode()));
			option.setLabel(msg.get("code",item.getCode(), locale));
			option.setSelected(item.getCode().equals(category));
			options.add(option);
		}
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, language, "none"));
			option.setLabel(wordsMsg.get("none", locale));
			option.setSelected("none".equals(category));
			options.add(option);			
		}
		return options;
	}
	
	private String buildUrl(Request request,String text, String language, String category) {
		UrlBuilder url = new UrlBuilder(request.getLocalContext());
		url.folder(request.getLanguage()).folder("search");
		url.parameter("category", category);
		url.parameter("language", language);
		url.parameter("text", text);
		return url.toString();
	}

	private List<Option> buildLanguageOptions(Request request) {
		List<Option> options = Lists.newArrayList();
		Messages wordsMsg = new Messages(WordsController.class);
		Messages msg = new Messages(Language.class);
		Query<Language> query = Query.of(Language.class).orderByName();
		List<Language> list = modelService.list(query);
		Locale locale = getLocale();
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, null, category));
			option.setLabel(wordsMsg.get("any", locale));
			option.setSelected(StringUtils.isBlank(language));
			options.add(option);			
		}
		for (Language item : list) {
			Option option = new Option();
			option.setValue(buildUrl(request, text, item.getCode(), category));
			option.setLabel(msg.get("code",item.getCode(), locale));
			option.setSelected(item.getCode().equals(language));
			options.add(option);
		}
		{
			Option option = new Option();
			option.setValue(buildUrl(request, text, "none", category));
			option.setLabel(wordsMsg.get("none", locale));
			option.setSelected("none".equals(language));
			options.add(option);			
		}
		return options;
	}

	public List<WordListPerspective> getList() throws ModelException {
		return this.list;
	}
	
	public String getText() {
		return text;
	}
	
	public String getLanguage() {
		return language;
	}
	
	public String getCategory() {
		return category;
	}
	
	public List<Option> getLanguageOptions() {
		return languageOptions;
	}
	
	public List<Option> getCategoryOptions() {
		return categoryOptions;
	}
	
	public String getEffectiveQuery() {
		return effectiveQuery;
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
		UrlBuilder url = new UrlBuilder(getRequest().getBaseContext()).folder(getRequest().getLanguage()).folder("search").folder(num);
		url.parameter("text", text).parameter("category", category).parameter("language", language);
		option.setValue(url.toString());
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
