package dk.in2isoft.onlineobjects.model;



public class ImagePart extends Entity {

	public static String TYPE = Entity.TYPE+"/ImagePart";
	public static String NAMESPACE = Entity.NAMESPACE+"ImagePart/";
	
	public ImagePart() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "Element/Image";
	}
}
