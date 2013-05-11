package dk.in2isoft.onlineobjects.apps.photos.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Numbers;
import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.apps.photos.GalleryImagePerspective;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;

public class PhotosGalleryView extends AbstractManagedBean implements InitializingBean {
	
	private ModelService modelService;
	
	private ImageGallery imageGallery;
	private String title;

	private List<GalleryImagePerspective> images;
	
	private String username;

	private User user;
	
	private boolean modifiable;

	private ListModel<Image> listModel;
	

	public void afterPropertiesSet() throws Exception {
		Request request = getRequest();
		String[] path = request.getLocalPath();
		long id = Numbers.parseLong(path[2]);
		if (id>0) {
			imageGallery = modelService.get(ImageGallery.class, id,request.getSession());
			if (imageGallery==null) {
				throw new ContentNotFoundException("The gallery does not exist");
			}
			final UserSession session = request.getSession();
			title = imageGallery.getName();
			user = modelService.getOwner(imageGallery);
			username = user.getUsername();
			modifiable = user!=null && user.getId()==session.getIdentity();
			List<Image> childImages = modelService.getChildrenOrdered(imageGallery, Image.class);
			images = Lists.newArrayList();
			for (Image image : childImages) {
				GalleryImagePerspective perspective = new GalleryImagePerspective();
				perspective.setId(image.getId());
				perspective.setTitle(image.getName());
				perspective.setRemovable(modifiable);
				perspective.setImage(image);
				images.add(perspective);
			}
			listModel = new ListModel<Image>() {

				@Override
				public ListModelResult<Image> getResult() {
					try {
						List<Image> childImages = modelService.getChildrenOrdered(imageGallery, Image.class,session);
						this.setPageSize(childImages.size());
						return new ListModelResult<Image>(childImages,childImages.size());
					} catch (ModelException e) {
						return null;
					}
				}
				
			};

		}
	}
	
	public ListModel<Image> getListModel() {
		return listModel;
	}
	
	public ImageGallery getImageGallery() {
		return imageGallery;
	}
	
	protected User getUser() {
		return user;
	}
	
	public String getUsername() {
		return username;
	}
	
	public List<GalleryImagePerspective> getImages() {
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
