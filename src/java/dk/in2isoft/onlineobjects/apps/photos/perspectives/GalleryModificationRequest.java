package dk.in2isoft.onlineobjects.apps.photos.perspectives;

import java.util.List;

import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;

public class GalleryModificationRequest {

	private long galleryId;
	
	private List<SimpleEntityPerspective> images;

	public long getGalleryId() {
		return galleryId;
	}

	public void setGalleryId(long galleryId) {
		this.galleryId = galleryId;
	}

	public List<SimpleEntityPerspective> getImages() {
		return images;
	}

	public void setImages(List<SimpleEntityPerspective> images) {
		this.images = images;
	}
}
