package dk.in2isoft.commons.lang;

import java.util.Map;
import java.util.Set;

import com.google.common.collect.Maps;

public class Counter<T> {

	private Map<T,Integer> map = Maps.newHashMap();
	
	public void addOne(T key) {
		if (map.containsKey(key)) {
			map.put(key, map.get(key)+1);
		} else {
			map.put(key, 1);
		}
	}
	
	public Map<T, Integer> getMap() {
		return map;
	}
	
	public T getTop() {
		T found = null;
		Set<T> keys = map.keySet();
		int top = -1;
		for (T key : keys) {
			if (map.get(key)>top) {
				found = key;
				top = map.get(key);
			}
		}
		return found;
	}
}
