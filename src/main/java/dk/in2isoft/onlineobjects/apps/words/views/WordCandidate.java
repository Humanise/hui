package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;

public class WordCandidate {
	private String text;
	private boolean known;
	private boolean primaryLanguage;
	private int count;
	private List<String> languages;
	

	public void setText(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}

	public void setKnown(boolean known) {
		this.known = known;
	}

	public boolean isKnown() {
		return known;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public int getCount() {
		return count;
	}

	public List<String> getLanguages() {
		return languages;
	}

	public void setLanguages(List<String> languages) {
		this.languages = languages;
	}

	public boolean isPrimaryLanguage() {
		return primaryLanguage;
	}

	public void setPrimaryLanguage(boolean primaryLanguage) {
		this.primaryLanguage = primaryLanguage;
	}
}