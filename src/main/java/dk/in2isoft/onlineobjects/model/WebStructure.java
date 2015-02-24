package dk.in2isoft.onlineobjects.model;


public class WebStructure extends Entity {

	public static String TYPE = Entity.TYPE+"/WebStructure";
	public static String NAMESPACE = Entity.NAMESPACE+"WebStructure/";

	public WebStructure() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "Basic/Internet";
	}

	@Override
	public String getNamespace() {
		return NAMESPACE;
	}
}
