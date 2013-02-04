package dk.in2isoft.onlineobjects.model;



public class HtmlPart extends Entity {

	public static String TYPE = Entity.TYPE+"/HtmlPart";
	public static String NAMESPACE = Entity.NAMESPACE+"HtmlPart/";
	
	private String html;
	
	public HtmlPart() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getHtml() {
		return html;
	}

	public void setHtml(String html) {
		this.html = html;
	}
}
