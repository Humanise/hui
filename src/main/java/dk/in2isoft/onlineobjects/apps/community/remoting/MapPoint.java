package dk.in2isoft.onlineobjects.apps.community.remoting;

import dk.in2isoft.commons.geo.GeoLatLng;


public class MapPoint implements GeoLatLng {

	private double lat;
	private double lng;

	public void setLat(double lat) {
		this.lat = lat;
	}

	public double getLat() {
		return lat;
	}

	public void setLng(double lng) {
		this.lng = lng;
	}

	public double getLng() {
		return lng;
	}
}
