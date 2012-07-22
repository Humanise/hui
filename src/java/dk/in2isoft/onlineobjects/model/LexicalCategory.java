package dk.in2isoft.onlineobjects.model;


public class LexicalCategory extends Entity {

	public static final String CODE = "code";
	public static String TYPE = Entity.TYPE+"/LexicalCategory";
	public static String NAMESPACE = Entity.NAMESPACE+"LexicalCategory/";
	
	private String code;
		
	public LexicalCategory() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "Element/Generic";
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}
}
