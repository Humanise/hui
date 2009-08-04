package dk.in2isoft.onlineobjects.model;

import org.apache.velocity.runtime.parser.node.MathUtils;

import dk.in2isoft.commons.geo.GeoLatLng;

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
	
	/* Util */
	
	public double getLatitudeDegrees() {
		return new GeoLatLng(Math.abs(latitude)).getDegrees();
	}
	
	public double getLatitudeMinutes() {
		return new GeoLatLng(Math.abs(latitude)).getMinutes();
	}
	
	public double getLatitudeSeconds() {
		return new GeoLatLng(Math.abs(latitude)).getSeconds();
	}
	
	public boolean isLatitudeNorth() {
		return latitude>0;
	}
	
	public double getLongitudeDegrees() {
		return new GeoLatLng(Math.abs(longitude)).getDegrees();
	}
	
	public double getLongitudeMinutes() {
		return new GeoLatLng(Math.abs(longitude)).getMinutes();
	}
	
	public double getLongitudeSeconds() {
		return new GeoLatLng(Math.abs(longitude)).getSeconds();
	}
	
	public boolean isLongitudeEast() {
		return longitude>0;
	}
}
