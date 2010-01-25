package dk.in2isoft.onlineobjects.model;

public class Invitation extends Entity {

	public static String TYPE = Entity.TYPE+"/Invitation";
	public static String NAMESPACE = Entity.NAMESPACE+"Invitation/";
	
	public static String FIELD_CODE = "code";
	
	public static String STATE_ACTIVE = "active";
	public static String STATE_CANCELED = "canceled";
	public static String STATE_ACCEPTED = "accepted";
	public static String STATE_REJECTED = "rejected";
	
	private String code;
	private String message;
	private String state; 

	public Invitation() {
		super();
		this.state = STATE_ACTIVE;
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "common/letter";
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
}
