package dk.in2isoft.onlineobjects.util.semantics;

public class Language {
	
	public boolean isWord(String word) {
		return true;
	}
	
	public boolean isCommonWord(String word) {
		return false;
	}
	
	public String stem(String word) {
		return word;
	}
}
