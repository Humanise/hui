package dk.in2isoft.onlineobjects.apps.photos.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;

public class PhotosUserView extends AbstractManagedBean implements InitializingBean {

	private ModelService modelService;
	
	private String username;
	private User user;
	private Person person;
	private ListModel<Image> listModel;
	private boolean modifiable;
	
	public void afterPropertiesSet() throws Exception {
		String[] path = getRequest().getLocalPath();
		username = path[2];
		UserQuery query = new UserQuery().withUsername(username);
		Pair<User, Person> pair = modelService.searchPairs(query).getFirst();
		if (pair == null) {
			throw new ContentNotFoundException("User not found");
		}
		this.user = pair.getKey();
		this.person = pair.getValue();
		modifiable = this.user.getId() == getRequest().getSession().getUser().getId();
	}
	
	public String getUsername() {
		return username;
	}
	
	public String getPersonName() {
		return person.getFullName();
	}
	
	public ListModel<Image> getImageList() {
		if (listModel!=null) return listModel;
		ListModel<Image> model = new ListModel<Image>() {

			@Override
			public ListModelResult<Image> getResult() {
				Query<Image> query = Query.of(Image.class).withPrivileged(user).orderByCreated().withPaging(getPage(), getPageSize()).descending();
				if (!modifiable) {
					query.withPublicView();
				}
				SearchResult<Image> search = modelService.search(query);
				return new ListModelResult<Image>(search.getList(),search.getTotalCount());
			}
			
		};
		model.setPageSize(40);
		listModel = model;
		return model;
	}
	
	// Wiring...

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
}
