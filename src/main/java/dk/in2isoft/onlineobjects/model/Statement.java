package dk.in2isoft.onlineobjects.model;



public class Statement extends Entity {

	public static String TYPE = Entity.TYPE+"/Statement";
	public static String NAMESPACE = Entity.NAMESPACE+"Statement/";
	
	private String text;
	
	public Statement() {
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
