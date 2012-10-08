package dk.in2isoft.onlineobjects.model;


public class WebNode extends Entity {

	public static String TYPE = Entity.TYPE+"/WebNode";
	public static String NAMESPACE = Entity.NAMESPACE+"WebNode/";

	public WebNode() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "monochrome/globe";
	}

	@Override
	public String getNamespace() {
		return NAMESPACE;
	}
}
