package dk.in2isoft.onlineobjects.apps.community.remoting;

public class MapQuery {
	
	private String words;
	private MapPoint northEast;
	private MapPoint southWest;

	public void setWords(String words) {
		this.words = words;
	}

	public String getWords() {
		return words;
	}

	public void setNorthEast(MapPoint northEast) {
		this.northEast = northEast;
	}

	public MapPoint getNorthEast() {
		return northEast;
	}

	public void setSouthWest(MapPoint southWest) {
		this.southWest = southWest;
	}

	public MapPoint getSouthWest() {
		return southWest;
	}
}
