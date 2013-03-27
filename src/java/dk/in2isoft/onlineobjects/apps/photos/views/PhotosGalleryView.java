package dk.in2isoft.onlineobjects.apps.photos.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.lang.Numbers;
import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;

public class PhotosGalleryView extends AbstractManagedBean implements InitializingBean {
	
	private ModelService modelService;
	
	private ImageGallery imageGallery;
	private String title;

	private List<Image> images;

	private User user;
	
	private boolean modifiable;

	public void afterPropertiesSet() throws Exception {
		Request request = getRequest();
		String[] path = request.getLocalPath();
		long id = Numbers.parseLong(path[2]);
		imageGallery = modelService.get(ImageGallery.class, id,request.getSession());
		if (imageGallery==null) {
			throw new ContentNotFoundException("The gallery does not exist");
		}
		title = imageGallery.getName();
		user = modelService.getOwner(imageGallery);
		modifiable = user!=null && user.getId()==request.getSession().getIdentity();
		images = modelService.getChildrenOrdered(imageGallery, Image.class);
	}
	
	public List<Image> getImages() {
		return images;
	}
	
	public String getTitle() {
		return title;
	}
	
	public boolean isModifiable() {
		return modifiable;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
