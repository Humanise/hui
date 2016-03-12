package dk.in2isoft.onlineobjects.core;

import java.io.Serializable;

public class Pair<K,V> implements Serializable {

	private static final long serialVersionUID = 5984618679818077327L;

	private K key;
	private V value;
	
	public Pair(K key, V value) {
		super();
		this.key = key;
		this.value = value;
	}
	
	public static <K,V> Pair<K,V> of(K key, V value) {
		return new Pair<K, V>(key, value);
	}
	
	public void setKey(K key) {
		this.key = key;
	}
	public K getKey() {
		return key;
	}
	public void setValue(V value) {
		this.value = value;
	}
	public V getValue() {
		return value;
	}
}
