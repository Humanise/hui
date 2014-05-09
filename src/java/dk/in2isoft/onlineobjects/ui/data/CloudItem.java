package dk.in2isoft.onlineobjects.ui.data;

public class CloudItem<T> {
	private int count;
	private float fraction;
	private int level;
	private T object;

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public float getFraction() {
		return fraction;
	}

	public void setFraction(float fraction) {
		this.fraction = fraction;
	}

	public T getObject() {
		return object;
	}

	public void setObject(T object) {
		this.object = object;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}
}
