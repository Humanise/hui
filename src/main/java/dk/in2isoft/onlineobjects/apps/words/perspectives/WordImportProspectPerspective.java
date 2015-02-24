package dk.in2isoft.onlineobjects.apps.words.perspectives;

import java.util.Collection;
import java.util.Map;

public class WordImportProspectPerspective {

	private String text;
	
	private Map<String,Collection<String>> existing;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Map<String,Collection<String>> getExisting() {
		return existing;
	}

	public void setExisting(Map<String, Collection<String>> map) {
		this.existing = map;
	}
	
}
