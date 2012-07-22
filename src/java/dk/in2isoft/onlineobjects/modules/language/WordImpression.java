package dk.in2isoft.onlineobjects.modules.language;

import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Word;

public class WordImpression {

	private Word word;
	private LexicalCategory lexicalCategory;
	private Language language;

	public void setWord(Word word) {
		this.word = word;
	}

	public Word getWord() {
		return word;
	}

	public void setLexicalCategory(LexicalCategory lexicalCategory) {
		this.lexicalCategory = lexicalCategory;
	}

	public LexicalCategory getLexicalCategory() {
		return lexicalCategory;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Language getLanguage() {
		return language;
	}

}
