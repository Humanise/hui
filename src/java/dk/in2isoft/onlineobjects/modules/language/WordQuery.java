package dk.in2isoft.onlineobjects.modules.language;

import dk.in2isoft.onlineobjects.modules.photos.IndexQuery;

public class WordQuery extends IndexQuery {
	private String letter;
	private String category;
	private String language;

	public WordQuery withText(String text) {
		this.text = text;
		return this;
	}
	
	public WordQuery withPage(int page) {
		this.page = page;
		return this;
	}
	
	public WordQuery withPageSize(int pageSize) {
		this.pageSize = pageSize;
		return this;
	}
	
	public WordQuery withLetter(String letter) {
		this.letter = letter;
		return this;
	}
	
	public String getLetter() {
		return letter;
	}
	
	public WordQuery withCategory(String category) {
		this.category = category;
		return this;
	}
	
	public String getCategory() {
		return category;
	}
	
	public WordQuery withLanguage(String language) {
		this.language = language;
		return this;
	}
	
	public String getLanguage() {
		return language;
	}
}
