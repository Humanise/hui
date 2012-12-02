package dk.in2isoft.onlineobjects.apps.community.views;

import java.util.ArrayList;
import java.util.List;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;
import dk.in2isoft.onlineobjects.ui.jsf.model.ImageContainer;

public class ImagesView extends AbstractManagedBean {

	private ModelService modelService;
	private SecurityService securityService;
	
	public ListModel<Photo> getImageList() {
		ListModel<Photo> model = new ListModel<Photo>() {

			@Override
			public ListModelResult<Photo> getResult() {
				Query<Image> query = Query.of(Image.class).orderByCreated().withPaging(getPage(), getPageSize()).withPrivileged(securityService.getPublicUser());
				SearchResult<Image> result = modelService.search(query);
				List<Photo> list = convert(result.getList());
				return new ListModelResult<Photo>(list,result.getTotalCount());
			}
			
		};
		model.setPageSize(24);
		return model;
	}
	
	private List<Photo> convert(List<Image> images) {
		List<Photo> list = new ArrayList<Photo>();
		for (Image image : images) {
			Photo photo = new Photo();
			photo.setImage(image);
			try {
				photo.setUser(modelService.getOwner(image));
			} catch (ModelException ignore) {
			}
			list.add(photo);
		}		
		return list;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}

	public class Photo implements ImageContainer {
		private Image image;
		private User user;

		public void setImage(Image image) {
			this.image = image;
		}

		public Image getImage() {
			return image;
		}

		public void setUser(User user) {
			this.user = user;
		}

		public User getUser() {
			return user;
		}
	}
}
