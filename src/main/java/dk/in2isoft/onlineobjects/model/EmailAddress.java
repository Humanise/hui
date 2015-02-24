package dk.in2isoft.onlineobjects.model;

public class EmailAddress extends Entity {

	public static final String ADDRESS_PROPERTY = "address";
	public static String TYPE = Entity.TYPE+"/EmailAddress";
	public static String NAMESPACE = Entity.NAMESPACE+"EmailAddress/";
	
	public static String CONTEXT_PRIVATE = "private";
	public static String CONTEXT_WORK = "work";
	public static String CONTEXT_SCHOOL = "school";
	public static String CONTEXT_OTHER = "other";
	
	private String context;
	private String address;

	public EmailAddress() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "common/email";
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
		setName(address);
	}

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}
}
