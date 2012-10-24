package dk.in2isoft.onlineobjects.modules.language;

public class SimpleWordImpression {

	private String text;
	private long id;
	private String lexicalCategory;
	private String language;

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
}
