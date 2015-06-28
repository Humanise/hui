package dk.in2isoft.onlineobjects.service.language;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;

public class TextAnalysis {

	private String language;
	private Map<String, Collection<String>> wordsByLanguage;
	private List<String> sentences;
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

	public List<String> getSentences() {
		return sentences;
	}

	public void setSentences(List<String> sentences) {
		this.sentences = sentences;
	}

	public Map<String, Collection<String>> getWordsByLanguage() {
		return wordsByLanguage;
	}

	public void setWordsByLanguage(Map<String, Collection<String>> wordsByLanguage) {
		this.wordsByLanguage = wordsByLanguage;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}
}
