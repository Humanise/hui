package dk.in2isoft.onlineobjects.model;

public class InternetAddress extends Entity {

	public static String TYPE = Entity.TYPE+"/InternetAddress";
	public static String NAMESPACE = Entity.NAMESPACE+"InternetAddress/";
	public static String FIELD_ADDRESS = "address";
	
	private String address;
	private String context;

	public InternetAddress() {
		super();
	}

	public String getType() {
		return TYPE;
	}
	
	@Override
	public String getIcon() {
		return "common/internet";
	}

	public void setAddress(String address) {
		if (address!=null && address.length()>255) {
			address = address.substring(0, 255);
		}
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
