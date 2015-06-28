package dk.in2isoft.onlineobjects.model;

public class Vote extends Entity {

	public static String TYPE = Entity.TYPE+"/Vote";
	public static String NAMESPACE = Entity.NAMESPACE+"Vote/";
	private static String ICON = "Element/Folder";
	
	public Vote() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return ICON;
	}
}
