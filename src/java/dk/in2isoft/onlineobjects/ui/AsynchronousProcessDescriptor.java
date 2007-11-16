package dk.in2isoft.onlineobjects.ui;

public class AsynchronousProcessDescriptor {
	
	private boolean completed;
	private boolean error;
	private float value;
	
	public AsynchronousProcessDescriptor() {
		
	}
	
	public boolean isCompleted() {
		return completed;
	}
	public void setCompleted(boolean completed) {
		this.completed = completed;
	}
	public float getValue() {
		return value;
	}
	public void setValue(float value) {
		this.value = value;
	}

	public boolean isError() {
		return error;
	}

	public void setError(boolean error) {
		this.error = error;
	}

}
