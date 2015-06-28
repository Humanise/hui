package dk.in2isoft.onlineobjects.apps.photos.perspectives;

import dk.in2isoft.onlineobjects.model.Image;

public class GalleryImagePerspective {

	private long id;
	private String title;
	private boolean removable;
	private Image image;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public boolean isRemovable() {
		return removable;
	}

	public void setRemovable(boolean removable) {
		this.removable = removable;
	}

	public void setImage(Image image) {
		this.image = image;
	}
	
	public Image getImage() {
		return image;
	}
}
