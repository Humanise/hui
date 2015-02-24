package dk.in2isoft.onlineobjects.model;


public class WebPage extends Entity {

	public static final String PROPERTY_TEMPLATE = "item.enitity.webpage.template";
	
	public static String TYPE = Entity.TYPE+"/WebPage";
	public static String NAMESPACE = Entity.NAMESPACE+"WebPage/";
	
	private String title;
	
	public WebPage() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "common/page";
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
}
