package dk.in2isoft.commons.parsing;

import java.net.MalformedURLException;

public class TextDocument {

	private String raw;
		
	public TextDocument(String raw) {
		this.raw = raw;
	}	
	
	public String getRawString() {
		return raw;
	}
}
