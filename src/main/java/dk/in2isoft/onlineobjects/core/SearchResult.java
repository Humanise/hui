package dk.in2isoft.onlineobjects.core;

import java.util.List;

import org.eclipse.jdt.annotation.Nullable;

import com.google.common.collect.Lists;

public class SearchResult<T> {
	private List<T> result;
	private int totalCount;
	private String description;
	
	public SearchResult(List<T> result, int totalCount) {
		this.result = result;
		this.totalCount = totalCount;
	}
	
	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}
		
	public List<T> getList() {
		return result;
	}

	public @Nullable T getFirst() {
		if (result.size()>0) {
			return result.get(0);
		}
		return null;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public static <T> SearchResult<T> empty() {
		List<T> list = Lists.newArrayList();
		return new SearchResult<T>(list,0);
	}
}
