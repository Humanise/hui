package dk.in2isoft.onlineobjects.model;

public class Topic extends Entity {

	public static String TYPE = Entity.TYPE+"/Topic";
	public static String NAMESPACE = Entity.NAMESPACE+"Topic/";
	private static String ICON = "Element/Folder";

	public Topic() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return ICON;
	}
}
