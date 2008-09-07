package dk.in2isoft.onlineobjects.model;

public class Application extends Entity {

	public static final String PROPERTY_URL_MAPPING = "item.entity.application.urlmapping";
	
	public static String TYPE = Entity.TYPE+"/Application";
	public static String NAMESPACE = Entity.NAMESPACE+"Application/";
	private static String ICON = "common/object";

	public Application() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return ICON;
	}
}
