package dk.in2isoft.onlineobjects.model;


public class Address extends Entity {

	public static String TYPE = Entity.TYPE+"/Address";
	public static String NAMESPACE = Entity.NAMESPACE+"Address/";
	private static String ICON = "geo/map";
	
	private String street;
	private String city;
	private String region;
	private String country;
	private String postalCode;
	
	public Address() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return ICON;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCity() {
		return city;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getStreet() {
		return street;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getCountry() {
		return country;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getRegion() {
		return region;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public String getPostalCode() {
		return postalCode;
	}
}
