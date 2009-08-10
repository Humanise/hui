package dk.in2isoft.onlineobjects.core;

import java.util.List;

public class SearchResult<T> {
	private List<T> result;
	private int totalCount;
	
	public SearchResult(List<T> result, int totalCount) {
		this.result = result;
		this.totalCount = totalCount;
	}
	
	public int getTotalCount() {
		return totalCount;
	}
	
	@Deprecated
	public List<T> getResult() {
		return result;
	}
	
	public List<T> getList() {
		return result;
	}

	public T getFirst() {
		if (result.size()>0) {
			return result.get(0);
		}
		return null;
	}
}
