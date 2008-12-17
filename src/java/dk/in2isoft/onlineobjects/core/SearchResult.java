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
	
	public List<T> getResult() {
		return result;
	}
}
