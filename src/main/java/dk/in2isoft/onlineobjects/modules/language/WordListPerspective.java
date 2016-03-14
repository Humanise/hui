package dk.in2isoft.onlineobjects.modules.language;

import dk.in2isoft.commons.lang.Strings;

public class WordListPerspective {

	private String text;
	private String highlightedText;
	private String urlPart;
	private long id;
	private String lexicalCategory;
	private String language;
	private String glossary;
	private String highlightedGlossary;
	private Long sourceId;

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

	public String getLexicalCategory() {
		return lexicalCategory;
	}

	public void setLexicalCategory(String lexicalCategory) {
		this.lexicalCategory = lexicalCategory;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getUrlPart() {
		return urlPart;
	}

	public void setUrlPart(String urlPart) {
		this.urlPart = urlPart;
	}

	public String getGlossary() {
		return glossary;
	}

	public void setGlossary(String glossary) {
		this.glossary = glossary;
	}
	
	@Override
	public String toString() {
		return Strings.concatWords(text,language,lexicalCategory,glossary);
	}

	public String getHighlightedText() {
		return highlightedText;
	}

	public void setHighlightedText(String highlightedText) {
		this.highlightedText = highlightedText;
	}

	public String getHighlightedGlossary() {
		return highlightedGlossary;
	}

	public void setHighlightedGlossary(String highlightedGlossary) {
		this.highlightedGlossary = highlightedGlossary;
	}

	public Long getSourceId() {
		return sourceId;
	}

	public void setSourceId(Long sourceId) {
		this.sourceId = sourceId;
	}
}
