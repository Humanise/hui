package dk.in2isoft.onlineobjects.model;



public class Hypothesis extends Entity {

	public static String TYPE = Entity.TYPE+"/Hypothesis";
	public static String NAMESPACE = Entity.NAMESPACE+"Hypothesis/";
	
	private String text;
	
	public Hypothesis() {
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
