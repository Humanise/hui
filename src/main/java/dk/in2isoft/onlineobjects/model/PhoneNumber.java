package dk.in2isoft.onlineobjects.model;

public class PhoneNumber extends Entity {

	public static String TYPE = Entity.TYPE+"/PhoneNumber";
	public static String NAMESPACE = Entity.NAMESPACE+"PhoneNumber/";
	
	public static String CONTEXT_PRIVATE = "private";
	public static String CONTEXT_WORK = "work";
	public static String CONTEXT_SCHOOL = "school";
	public static String CONTEXT_OTHER = "other";
	
	private String context;
	private String number;

	public PhoneNumber() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "common/phone";
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
		setName(number);
	}

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}
}
