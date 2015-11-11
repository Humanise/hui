package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import dk.in2isoft.in2igui.data.ItemData;

public class QuestionEditPerspective {

	private long id;
	private String text;

	private List<ItemData> answers;
	private List<ItemData> authors;

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

	public List<ItemData> getAnswers() {
		return answers;
	}

	public void setAnswers(List<ItemData> answers) {
		this.answers = answers;
	}

	public List<ItemData> getAuthors() {
		return authors;
	}

	public void setAuthors(List<ItemData> authors) {
		this.authors = authors;
	}

}
