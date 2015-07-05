package dk.in2isoft.onlineobjects.model;



public class Question extends Entity {

	public static String TYPE = Entity.TYPE+"/Question";
	public static String NAMESPACE = Entity.NAMESPACE+"Question/";
	
	private String text;
	
	public Question() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
}
