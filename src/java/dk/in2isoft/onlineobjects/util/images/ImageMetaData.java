package dk.in2isoft.onlineobjects.util.images;

import java.util.Date;

public class ImageMetaData {
	private String objectName;
	private String caption;
	private String[] keywords;
	private Date dateTime;
	private String cameraMake;
	private String cameraModel;
	private Double latitude;
	private Double longitude;
	private Integer orientation;
	private Integer rotation;
	private Boolean flippedVertically;
	private Boolean flippedHorizontally;
	
	public void setDateTime(Date dateTime) {
		this.dateTime = dateTime;
	}
	
	public Date getDateTime() {
		return dateTime;
	}
	
	public void setCameraMake(String make) {
		this.cameraMake = make;
	}
	
	public String getCameraMake() {
		return cameraMake;
	}

	public void setCameraModel(String cameraModel) {
		this.cameraModel = cameraModel;
	}

	public String getCameraModel() {
		return cameraModel;
	}

	public void setLatitude(Double lattitude) {
		this.latitude = lattitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setObjectName(String objectName) {
		this.objectName = objectName;
	}

	public String getObjectName() {
		return objectName;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	public String getCaption() {
		return caption;
	}

	public void setKeywords(String[] keywords) {
		this.keywords = keywords;
	}

	public String[] getKeywords() {
		return keywords;
	}

	public Integer getOrientation() {
		return orientation;
	}

	public void setOrientation(Integer orientation) {
		this.orientation = orientation;
	}

	public Integer getRotation() {
		return rotation;
	}

	public void setRotation(Integer rotation) {
		this.rotation = rotation;
	}

	public Boolean getFlippedVertically() {
		return flippedVertically;
	}

	public void setFlippedVertically(Boolean flipped) {
		this.flippedVertically = flipped;
	}

	public Boolean getFlippedHorizontally() {
		return flippedHorizontally;
	}

	public void setFlippedHorizontally(Boolean flippedHorizontally) {
		this.flippedHorizontally = flippedHorizontally;
	}
	
}
