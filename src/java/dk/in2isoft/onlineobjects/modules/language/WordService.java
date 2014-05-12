package dk.in2isoft.onlineobjects.modules.language;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexableField;
import org.apache.lucene.queryparser.flexible.standard.QueryParserUtil;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexSearchResult;

public class WordService {
	
	private IndexManager index;
	private ModelService modelService;
	
	public SearchResult<WordListPerspective> search(WordQuery query) throws ExplodingClusterFuckException, ModelException {
		final List<Long> ids = Lists.newArrayList();
		String searchQuery = buildQuery(query);
		SearchResult<IndexSearchResult> indexResult = index.search(searchQuery,query.getPage(),query.getPageSize());
		if (indexResult.getTotalCount()==0) {
			return SearchResult.empty();
		}
		for (IndexSearchResult item : indexResult.getList()) {
			Document document = item.getDocument();
			IndexableField field = document.getField("id");
			ids.add(Long.parseLong(field.stringValue()));
		}
		WordListPerspectiveQuery listQuery = new WordListPerspectiveQuery().withPaging(0, query.getPageSize()).orderByUpdated();
		if (!ids.isEmpty()) {
			listQuery.withIds(ids);
		}
		SearchResult<WordListPerspective> result = modelService.search(listQuery);
		
		Collections.sort(result.getList(), new Comparator<WordListPerspective>() {

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
		result.setTotalCount(indexResult.getTotalCount());
		result.setDescription(searchQuery);
		return result;
	}
	
	private String buildQuery(WordQuery query) {

		String text = query.getText();
		String letter = query.getLetter();
		String language = query.getLanguage();
		String category = query.getCategory();
		
		StringBuilder searchQuery = new StringBuilder();
		if (StringUtils.isNotBlank(text)) {
			searchQuery.append("(word:").append(QueryParserUtil.escape(text)).append("^4").append(" OR word:").append(QueryParserUtil.escape(text)).append("*^4 OR ").append(QueryParserUtil.escape(text)).append("*)");
		}
		if (StringUtils.isNotBlank(letter)) {
			if (searchQuery.length()>0) {
				searchQuery.append(" AND ");
			}
			searchQuery.append("(letter:").append(QueryParserUtil.escape(letter)).append(")");
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
		return searchQuery.toString();
	}
	
	// Wiring...
	
	public void setIndex(IndexManager index) {
		this.index = index;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
