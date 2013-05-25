package dk.in2isoft.onlineobjects.apps.photos.views;

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
import dk.in2isoft.onlineobjects.ui.jsf.model.GalleryItem;

public class PhotosFrontView extends AbstractManagedBean {

	private ModelService modelService;
	private SecurityService securityService;
	
	public ListModel<GalleryItem> getImageList() {
		ListModel<GalleryItem> model = new ListModel<GalleryItem>() {

			@Override
			public ListModelResult<GalleryItem> getResult() {
				Query<Image> query = Query.of(Image.class).orderByCreated().withPaging(getPage(), getPageSize()).withPrivileged(securityService.getPublicUser()).descending();
				SearchResult<Image> result = modelService.search(query);
				List<GalleryItem> list = convert(result.getList());
				return new ListModelResult<GalleryItem>(list,result.getTotalCount());
			}
			
		};
		model.setPageSize(24);
		return model;
	}
	
	private List<GalleryItem> convert(List<Image> images) {
		List<GalleryItem> list = new ArrayList<GalleryItem>();
		for (Image image : images) {
			User user = null;
			try {
				user = modelService.getOwner(image);
			} catch (ModelException ignore) {
			}
			list.add(GalleryItem.create(image, user));
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
}
