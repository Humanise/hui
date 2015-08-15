package dk.in2isoft.commons.lang;

import java.util.List;

import org.eclipse.jdt.annotation.Nullable;

import com.google.common.collect.Lists;

public class Matrix<X, Y, V> {


	private List<MatrixEntry<X,Y,V>> entries;
	
	public Matrix() {
		entries = Lists.newArrayList();
	}
	
	public void put(X x,Y y,V value) {
		for (MatrixEntry<X,Y,V> entry : entries) {
			if (entry.getX().equals(x) && entry.getY().equals(y)) {
				entry.setValue(value);
				return;
			}
		}
		entries.add(new MatrixEntry<X,Y,V>(x,y,value));
	}
	
	public List<X> getX() {
		List<X> list = Lists.newArrayList();
		for (MatrixEntry<X,Y,V> entry : entries) {
			if (!list.contains(entry.getX())) {
				list.add(entry.getX());
			}
		}
		return list;
	}
	
	public List<Y> getY() {
		List<Y> list = Lists.newArrayList();
		for (MatrixEntry<X,Y,V> entry : entries) {
			if (!list.contains(entry.getY())) {
				list.add(entry.getY());
			}
		}
		return list;
	}
	
	public @Nullable V getValue(X x,Y y) {
		for (MatrixEntry<X,Y,V> entry : entries) {
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
				@Nullable
				V value = getValue(x, y);
				sb.append(" | ").append(toCell(value==null ? "" : value.toString()));
			}
			sb.append("\n");
		}
		return sb.toString();
	}
	
	public MatrixEntry<X,Y,V> getTop() {
		MatrixEntry<X,Y,V> top = null;
		for (MatrixEntry<X,Y,V> entry : this.entries) {
			if (entry.getX().equals(entry.getY()) || !(entry.getValue() instanceof Number)) {
				continue;
			}
			if (top==null || ((Number)entry.getValue()).doubleValue()>((Number)top.getValue()).doubleValue()) {
				top = entry;
			}
		}
		return top;
	}
	
	public List<MatrixEntry<X,Y,V>> getEntries() {
		return entries;
	}
	
	private String toCell(String string) {
		string = string.trim();
		string = string + "                                                                                                                                                      ";
		//return StringUtils.leftPad(string, 40, ' ');
		return string.substring(0, 40);
	}
}
