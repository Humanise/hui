package dk.in2isoft.onlineobjects.apps.reader.perspective;


public class StatementPerspective {
	private String text;
	private long id;
	private boolean found;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public boolean isFound() {
		return found;
	}

	public void setFound(boolean found) {
		this.found = found;
	}
}