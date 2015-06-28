package dk.in2isoft.onlineobjects.core;

import java.util.Iterator;
import java.util.List;

public class PairSearchResult<K,V> {
	private List<Pair<K,V>> result;
	private int totalCount;
	
	public PairSearchResult(List<Pair<K,V>> result, int totalCount) {
		this.result = result;
		this.totalCount = totalCount;
	}
	
	public int getTotalCount() {
		return totalCount;
	}
	
	public List<Pair<K,V>> getList() {
		return result;
	}
	
	public Iterator<Pair<K, V>> iterator() {
		return result.iterator();
	}

	public Pair<K,V> getFirst() {
		if (result.size()>0) {
			return result.get(0);
		}
		return null;
	}
}
