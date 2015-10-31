package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import dk.in2isoft.in2igui.data.ItemData;

public class StatementEditPerspective {

	private long id;
	private String text;
	private List<ItemData> authors;
	private List<ItemData> questions;
	private List<ItemData> supports;
	private List<ItemData> contradicts;

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
	
	public void setAuthors(List<ItemData> authors) {
		this.authors = authors;
	}
	
	public List<ItemData> getAuthors() {
		return authors;
	}

	public List<ItemData> getQuestions() {
		return questions;
	}

	public void setQuestions(List<ItemData> questions) {
		this.questions = questions;
	}

	public List<ItemData> getSupports() {
		return supports;
	}

	public void setSupports(List<ItemData> supports) {
		this.supports = supports;
	}

	public List<ItemData> getContradicts() {
		return contradicts;
	}

	public void setContradicts(List<ItemData> contradicts) {
		this.contradicts = contradicts;
	}
}
