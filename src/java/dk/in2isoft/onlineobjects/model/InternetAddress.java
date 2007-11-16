package dk.in2isoft.onlineobjects.model;

public class InternetAddress extends Entity {

	public static String TYPE = Entity.TYPE+"/InternetAddress";
	public static String NAMESPACE = Entity.NAMESPACE+"InternetAddress/";
	
	private String url;

	public InternetAddress() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "Element/EmailAddress";
	}

	public String getUrl() {
		return url;
	}

	public void setAddress(String url) {
		this.url = url;
	}
}
