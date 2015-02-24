package dk.in2isoft.in2igui.data;

public class LocationDataImpl implements LocationData {

	private Double latitude;
	private Double longitude;
	
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public Double getLongitude() {
		return longitude;
	}

}
