package dk.in2isoft.onlineobjects.model;


public class Language extends Entity {

	public static final String ENGLISH = "en";
	public static final String DANISH = "da";

	public static final String CODE = "code";

	
	public static String TYPE = Entity.TYPE+"/Language";
	public static String NAMESPACE = Entity.NAMESPACE+"Language/";
	
	private String code;
		
	public Language() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}
}
