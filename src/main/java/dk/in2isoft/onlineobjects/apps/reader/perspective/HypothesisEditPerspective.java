package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import dk.in2isoft.in2igui.data.ItemData;

public class HypothesisEditPerspective {

	private long id;
	private String text;

	private List<ItemData> contradictions;
	private List<ItemData> confirmations;
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

	public List<ItemData> getContradictions() {
		return contradictions;
	}

	public void setContradictions(List<ItemData> contradictions) {
		this.contradictions = contradictions;
	}

	public List<ItemData> getAuthors() {
		return authors;
	}

	public void setAuthors(List<ItemData> authors) {
		this.authors = authors;
	}

	public List<ItemData> getConfirmations() {
		return confirmations;
	}

	public void setConfirmations(List<ItemData> confirmations) {
		this.confirmations = confirmations;
	}

}
