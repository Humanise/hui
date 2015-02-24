package dk.in2isoft.onlineobjects.model;

public class Rating extends Entity {

	public static String TYPE = Entity.TYPE+"/Rating";
	public static String NAMESPACE = Entity.NAMESPACE+"Rating/";
	private static String ICON = "Element/Folder";

	private double rating;
	
	public Rating() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return ICON;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public double getRating() {
		return rating;
	}
}
