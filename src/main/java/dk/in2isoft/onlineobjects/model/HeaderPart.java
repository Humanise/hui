package dk.in2isoft.onlineobjects.model;



public class HeaderPart extends Entity {

	public static String TYPE = Entity.TYPE+"/HeaderPart";
	public static String NAMESPACE = Entity.NAMESPACE+"HeaderPart/";
	
	private String text;
	
	public HeaderPart() {
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
