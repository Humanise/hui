package dk.in2isoft.onlineobjects.util.images;

import java.util.Collection;
import java.util.Date;

public class ImageInfo {

	private long id;
	private String name;
	private String description;
	private Date taken;
	private String cameraMake;
	private String cameraModel;
	private Collection<String> tags;
	private ImageLocation location;
	private Double rotation;

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public void setTags(Collection<String> tags) {
		this.tags = tags;
	}

	public Collection<String> getTags() {
		return tags;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getId() {
		return id;
	}

	public void setTaken(Date taken) {
		this.taken = taken;
	}

	public Date getTaken() {
		return taken;
	}

	public void setCameraMake(String cameraMake) {
		this.cameraMake = cameraMake;
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

	public void setLocation(ImageLocation location) {
		this.location = location;
	}

	public ImageLocation getLocation() {
		return location;
	}

	public Double getRotation() {
		return rotation;
	}

	public void setRotation(Double rotation) {
		this.rotation = rotation;
	}

	public static class ImageLocation {
		private Double latitude;
		private Double longitude;
		
		public ImageLocation() {
			
		}
		
		public ImageLocation(double latitude, double longitude) {
			super();
			this.latitude = latitude;
			this.longitude = longitude;
		}

		public void setLatitude(Double latitude) {
			this.latitude = latitude;
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
	}
}
