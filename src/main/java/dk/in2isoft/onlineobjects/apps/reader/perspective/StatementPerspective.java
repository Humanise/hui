package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import dk.in2isoft.in2igui.data.ItemData;

public class StatementPerspective {

	private String text;
	private long id;
	private boolean found;
	private int firstPosition;
	private List<ItemData> authors;

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

	public int getFirstPosition() {
		return firstPosition;
	}

	public void setFirstPosition(int firstPosition) {
		this.firstPosition = firstPosition;
	}

	public List<ItemData> getAuthors() {
		return authors;
	}

	public void setAuthors(List<ItemData> authors) {
		this.authors = authors;
	}
}