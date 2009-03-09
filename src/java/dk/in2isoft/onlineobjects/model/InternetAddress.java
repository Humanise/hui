package dk.in2isoft.onlineobjects.model;

public class InternetAddress extends Entity {

	public static String TYPE = Entity.TYPE+"/InternetAddress";
	public static String NAMESPACE = Entity.NAMESPACE+"InternetAddress/";
	
	private String address;
	private String context;

	public InternetAddress() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getAddress() {
		return address;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public String getContext() {
		return context;
	}
}
