package dk.in2isoft.onlineobjects.apps.words.perspectives;

import java.util.List;

import dk.in2isoft.onlineobjects.ui.data.Option;

public class WordEnrichmentPerspective {
	
	private long wordId;
	private String text;
	
	private List<Option> enrichments;

	public long getWordId() {
		return wordId;
	}

	public void setWordId(long wordId) {
		this.wordId = wordId;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public List<Option> getEnrichments() {
		return enrichments;
	}

	public void setEnrichments(List<Option> enrichments) {
		this.enrichments = enrichments;
	}
}
