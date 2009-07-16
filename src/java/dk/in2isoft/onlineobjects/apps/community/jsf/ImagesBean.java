package dk.in2isoft.onlineobjects.apps.community.jsf;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;

@ManagedBean(name = "images")
@RequestScoped
public class ImagesBean extends AbstractManagedBean {

	
	public ListModel<Image> getImageList() {
		ListModel<Image> model = new ListModel<Image>() {

			@Override
			public ListModelResult<Image> getResult() {
				Query<Image> query = Query.of(Image.class).orderByCreated().withPaging(getPage(), getPageSize());
				SearchResult<Image> search = getModel().search(query);
				return new ListModelResult<Image>(search.getResult(),search.getTotalCount());
			}
			
		};
		model.setPageSize(24);
		return model;
	}
	
	public Long getImageId() {
		String[] path = getRequest().getLocalPath();
		String string = path[path.length-1];
		return null;
	}
}
