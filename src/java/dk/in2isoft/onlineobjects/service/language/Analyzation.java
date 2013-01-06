package dk.in2isoft.onlineobjects.service.language;

import java.util.List;

import dk.in2isoft.onlineobjects.modules.language.WordImpression;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;

public class Analyzation {

	private List<String> uniqueWords;
	private List<String> unknownWords;
	private List<WordListPerspective> knownWords;

	public List<String> getUnknownWords() {
		return unknownWords;
	}

	public void setUnknownWords(List<String> unknownWords) {
		this.unknownWords = unknownWords;
	}

	public List<String> getUniqueWords() {
		return uniqueWords;
	}

	public void setUniqueWords(List<String> uniqueWords) {
		this.uniqueWords = uniqueWords;
	}

	public List<WordListPerspective> getKnownWords() {
		return knownWords;
	}

	public void setKnownWords(List<WordListPerspective> knownWords) {
		this.knownWords = knownWords;
	}
}
