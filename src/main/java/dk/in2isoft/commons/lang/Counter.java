package dk.in2isoft.commons.lang;

import java.util.Map;
import java.util.Set;

import org.eclipse.jdt.annotation.Nullable;

import com.google.common.collect.Maps;

public class Counter<T> {

	private Map<T,Integer> map = Maps.newHashMap();
	
	public void addOne(T key) {
		add(key, 1);
	}
	
	public Map<T, Integer> getMap() {
		return map;
	}
	
	public @Nullable T getTop() {
		T found = (T) null;
		Set<T> keys = map.keySet();
		int top = -1;
		for (T key : keys) {
			if (map.get(key) > top) {
				found = key;
				top = map.get(key);
			}
		}
		return found;
	}

	public void add(T key, int count) {
		if (map.containsKey(key)) {
			map.put(key, map.get(key) + count);
		} else {
			map.put(key, count);
		}
	}
}
