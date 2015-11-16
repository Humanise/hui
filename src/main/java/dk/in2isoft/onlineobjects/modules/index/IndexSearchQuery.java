package dk.in2isoft.onlineobjects.modules.index;

import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.apache.lucene.search.SortField.Type;

public class IndexSearchQuery {

	private String query;
	
	private int page;
	
	private int pageSize;
	
	private Sort sort = new Sort();
	
	public IndexSearchQuery() {
		
	}
	
	public IndexSearchQuery(String query) {
		this.query = query;
	}	

	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}
	
	public void addStringOrdering(String field) {
		sort.setSort(new SortField(field, Type.STRING));
	}
	
	public void addLongOrdering(String field, boolean reverse) {
		sort.setSort(new SortField(field, Type.LONG, reverse));
	}
	
	public Sort getSort() {
		return sort;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
}
