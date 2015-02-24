package dk.in2isoft.commons.geo;

public class GeoPoint implements GeoLatLng {
	private GeoDistance latitude;
	private GeoDistance longitude;
	
	public GeoPoint() {
		
	}
	
	public GeoPoint(GeoDistance latitude, GeoDistance longitude) {
		super();
		this.latitude = latitude;
		this.longitude = longitude;
	}

	public void setLatitude(GeoDistance latitude) {
		this.latitude = latitude;
	}
	
	public GeoDistance getLatitude() {
		return latitude;
	}
	
	public void setLongitude(GeoDistance longitude) {
		this.longitude = longitude;
	}
	
	public GeoDistance getLongitude() {
		return longitude;
	}

	public double getLat() {
		if (latitude!=null) {
			return latitude.getDecimal();
		}
		return 0;
	}

	public double getLng() {
		if (longitude!=null) {
			return longitude.getDecimal();
		}
		return 0;
	}
}
