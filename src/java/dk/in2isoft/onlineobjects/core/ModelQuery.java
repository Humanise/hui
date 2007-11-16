package dk.in2isoft.onlineobjects.core;

public class ModelQuery {
	private String[] words;
	private String type = "Entity";

	public ModelQuery() {
		super();
	}
	
	public ModelQuery(Class<?> type) {
		super();
		this.type = type.getSimpleName();
	}

	public String[] getWords() {
		return words;
	}

	public void setWords(String[] words) {
		this.words = words;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
}
