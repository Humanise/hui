package dk.in2isoft.onlineobjects.modules.language;

import dk.in2isoft.commons.lang.Strings;

public class WordImportRow {

	private String text;
	private String language;
	private String category;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
	
	@Override
	public String toString() {
		return Strings.concatWords(text,language,category);
	}
}
