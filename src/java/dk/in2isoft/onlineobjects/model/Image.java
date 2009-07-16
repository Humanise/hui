package dk.in2isoft.onlineobjects.model;

import java.io.File;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;


public class Image extends Entity {

	public static final String PROPERTY_DESCRIPTION = "item.enity.image.description";
	public static String TYPE = Entity.TYPE+"/Image";
	public static String NAMESPACE = Entity.NAMESPACE+"Image/";
	
	private long fileSize;
	private String contentType;
	private int width;
	private int height;
	
	public Image() {
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
		return "common/image";
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

	public void changeImageFile(File imageFile,int width,int height,String contentType)
	throws EndUserException {
		this.width = width;
		this.height = height;
		this.contentType=contentType;
		this.fileSize = imageFile.length();
		File folder = Core.getInstance().getStorageService().getItemFolder(this);
		imageFile.renameTo(new File(folder,"original"));
	}
	
	public File getImageFile() {
		File folder = Core.getInstance().getStorageService().getItemFolder(this);
		return new File(folder,"original");
	}
}
