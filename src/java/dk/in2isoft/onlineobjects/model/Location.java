package dk.in2isoft.onlineobjects.model;

public class Location extends Entity {

	public static String TYPE = Entity.TYPE+"/Location";
	public static String NAMESPACE = Entity.NAMESPACE+"Location/";
	
	private double longitude;
	private double latitude;
	private double altitude;
	
	public Location() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "Element/Generic";
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setAltitude(double altitude) {
		this.altitude = altitude;
	}

	public double getAltitude() {
		return altitude;
	}
}
