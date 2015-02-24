package dk.in2isoft.commons.lang;


public class MatrixEntry<X,Y,V> {
	private X x;
	private Y y;
	private V value;
	
	public MatrixEntry(X x, Y y, V value) {
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
	
	@Override
	public String toString() {
		return "x: "+x+", y: "+y+", value: "+value;
	}
}