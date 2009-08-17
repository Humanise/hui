package dk.in2isoft.commons.lang;

import java.util.List;

import com.google.common.collect.Lists;

public class Matrix<X, Y, V> {


	private List<Entry> entries;
	
	public Matrix() {
		entries = Lists.newArrayList();
	}
	
	public void put(X x,Y y,V value) {
		for (Entry entry : entries) {
			if (entry.getX().equals(x) && entry.getY().equals(y)) {
				entry.setValue(value);
				return;
			}
		}
		entries.add(new Entry(x,y,value));
	}
	
	public List<X> getX() {
		List<X> list = Lists.newArrayList();
		for (Entry entry : entries) {
			if (!list.contains(entry.getX())) {
				list.add(entry.getX());
			}
		}
		return list;
	}
	
	public List<Y> getY() {
		List<Y> list = Lists.newArrayList();
		for (Entry entry : entries) {
			if (!list.contains(entry.getY())) {
				list.add(entry.getY());
			}
		}
		return list;
	}
	
	public V getValue(X x,Y y) {
		for (Entry entry : entries) {
			if (entry.getX().equals(x) && entry.getY().equals(y)) {
				return entry.getValue();
			}
		}
		return null;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		List<Y> yList = getY();
		List<X> xList = getX();
		sb.append(toCell(""));
		for (X x : xList) {
			sb.append(" | ").append(toCell(x.toString()));
		}
		sb.append("\n");
		for (Y y : yList) {
			sb.append(toCell(y.toString()));
			for (X x : xList) {
				sb.append(" | ").append(toCell(getValue(x, y).toString()));
			}
			sb.append("\n");
		}
		return sb.toString();
	}
	
	private String toCell(String string) {
		string = string + "                                                  ";
		return string.substring(0, 40);
	}
	
	public class Entry {
		private X x;
		private Y y;
		private V value;
		
		public Entry(X x, Y y, V value) {
			this.x=x;
			this.y=y;
			this.value=value;
		}

		public void setX(X x) {
			this.x = x;
		}
		
		public X getX() {
			return x;
		}
		
		public void setY(Y y) {
			this.y = y;
		}
		
		public Y getY() {
			return y;
		}
		
		public void setValue(V value) {
			this.value = value;
		}
		
		public V getValue() {
			return value;
		}
	}
}
