package dk.in2isoft.commons.lang;

import java.util.HashMap;
import java.util.Map;

public class Mapper<K,V> {

	private Map<K,V> map = new HashMap<K, V>();
	
	public static <K,V> Mapper<K,V> build(K key, V value) {
		return new Mapper<K, V>().add(key, value);
	}

	public Mapper<K,V> add(K key, V value) {
		map.put(key, value);
		return this;
	}
	
	public Map<K,V> get() {
		return map;
	}
}
