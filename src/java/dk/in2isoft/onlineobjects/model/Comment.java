package dk.in2isoft.onlineobjects.model;

public class Comment extends Entity {

	public static String TYPE = Entity.TYPE+"/Comment";
	public static String NAMESPACE = Entity.NAMESPACE+"Comment/";

	private String text;
	
	public Comment() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "file/generic";
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}
}
