package dk.in2isoft.onlineobjects.model;


public class Pile extends Entity {

	public static String TYPE = Entity.TYPE+"/Pile";
	public static String NAMESPACE = Entity.NAMESPACE+"Pile/";
	private static String ICON = "common/folder";
	
	public Pile() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return ICON;
	}
}
