package dk.in2isoft.commons.util;

public class ImageTransformation {
	private int width;
	private int height;
	private boolean cropped;
	private int sepia;
	
	public void setWidth(int width) {
		this.width = width;
	}
	public int getWidth() {
		return width;
	}
	public void setHeight(int height) {
		this.height = height;
	}
	public int getHeight() {
		return height;
	}
	public void setCropped(boolean cropped) {
		this.cropped = cropped;
	}
	public boolean isCropped() {
		return cropped;
	}
	public void setSepia(int sepia) {
		this.sepia = sepia;
	}
	public int getSepia() {
		return sepia;
	}
}
