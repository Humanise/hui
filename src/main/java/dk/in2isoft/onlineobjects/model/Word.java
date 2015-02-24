package dk.in2isoft.onlineobjects.model;


public class Word extends Entity {

	public static String TYPE = Entity.TYPE+"/Word";
	public static String NAMESPACE = Entity.NAMESPACE+"Word/";
	
	public static final String LEXICAL_CATEGORY_PROPERTY = "lexicalcategory";
	public static final String TEXT_FIELD = "text";
	
	private String text;
		
	public Word() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "common/object";
	}

	public void setText(String text) {
		this.text = text;
		this.name = text;
	}

	public String getText() {
		return text;
	}
	
}
