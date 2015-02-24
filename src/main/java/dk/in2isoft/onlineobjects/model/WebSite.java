package dk.in2isoft.onlineobjects.model;


public class WebSite extends Entity {

	public static String TYPE = Entity.TYPE+"/WebSite";
	public static String NAMESPACE = Entity.NAMESPACE+"WebSite/";

	public WebSite() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "common/internet";
	}

	@Override
	public String getNamespace() {
		return NAMESPACE;
	}
}
