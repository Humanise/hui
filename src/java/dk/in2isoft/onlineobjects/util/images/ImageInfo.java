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
}
