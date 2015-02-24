package dk.in2isoft.onlineobjects.model;


public class LexicalCategory extends Entity {

	public static final String CODE = "code";
	public static String TYPE = Entity.TYPE+"/LexicalCategory";
	public static String NAMESPACE = Entity.NAMESPACE+"LexicalCategory/";
	

	public static String CODE_NOMEN = "nomen";
	public static String CODE_PROPRIUM = "proprium";
	public static String CODE_PROPRIUM_FIRST = "proprium.personal.first";
	public static String CODE_PROPRIUM_MIDDLE = "proprium.personal.middle";
	public static String CODE_PROPRIUM_LAST = "proprium.personal.last";
	public static String CODE_APPELLATIV = "appellativ";
	public static String CODE_VERBUM = "verbum";
	public static String CODE_PRONOMEN = "pronomen";
	public static String CODE_ADJECTIVUM = "adjectivum";
	public static String CODE_ADVERBIUM = "adverbium";
	public static String CODE_PRAEPOSITION = "praeposition";
	public static String CODE_CONJUNCTION = "conjunction";
	public static String CODE_INTERJECTION = "interjection";
	public static String CODE_ARTICULUS = "articulus";
	public static String CODE_NUMERUS = "numerus";
	public static String CODE_ONOMATOPOEIA = "onomatopoeia";
	
	private String code;
		
	public LexicalCategory() {
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
