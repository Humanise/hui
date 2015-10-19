package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import dk.in2isoft.onlineobjects.ui.jsf.model.Option;

public class StatementEditPerspective {

	private long id;
	private String text;
	private List<Option> authors;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	public void setAuthors(List<Option> authors) {
		this.authors = authors;
	}
	
	public List<Option> getAuthors() {
		return authors;
	}
}
