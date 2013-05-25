package dk.in2isoft.onlineobjects.ui.jsf.model;

import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;

public class GalleryItem implements ImageContainer {

	private Image image;
	
	private SimpleEntityPerspective owner;

	public SimpleEntityPerspective getOwner() {
		return owner;
	}

	public void setOwner(SimpleEntityPerspective owner) {
		this.owner = owner;
	}
	
	public static GalleryItem create(Image image, User user) {
		GalleryItem item = new GalleryItem();
		item.setImage(image);
		if (user!=null) {
			item.setOwner(SimpleEntityPerspective.create(user)); 
		}
		return item;
	}

	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}
}
