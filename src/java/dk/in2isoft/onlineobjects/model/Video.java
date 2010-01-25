package dk.in2isoft.onlineobjects.model;



public class Video extends Entity {

	public static final String PROPERTY_DESCRIPTION = "item.enity.video.description";
	public static String TYPE = Entity.TYPE+"/Video";
	public static String NAMESPACE = Entity.NAMESPACE+"Video/";
	
	private long fileSize;
	private String contentType;
	private int width;
	private int height;
	
	public Video() {
		super();
	}

	public String getType() {
		return TYPE;
	}
	
	@Override
	public String getNamespace() {
		return NAMESPACE;
	}

	public String getIcon() {
		return "common/object";
	}
	
	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public long getFileSize() {
		return fileSize;
	}

	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}
}
