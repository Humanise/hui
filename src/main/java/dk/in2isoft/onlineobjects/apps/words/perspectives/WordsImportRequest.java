package dk.in2isoft.onlineobjects.apps.words.perspectives;

import java.util.Collection;

public class WordsImportRequest {
	private String sessionId;
	private String language;
	private String category;
	private Collection<String> words;

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

	public Collection<String> getWords() {
		return words;
	}

	public void setWords(Collection<String> words) {
		this.words = words;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String importId) {
		this.sessionId = importId;
	}
}
