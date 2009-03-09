package dk.in2isoft.onlineobjects.apps.community.jsf;

import java.util.List;

import dk.in2isoft.onlineobjects.apps.community.UserProfileInfo;
import dk.in2isoft.onlineobjects.apps.community.UserProfileInfoUtil;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;

public class UserProfileBean extends AbstractManagedBean {
	
	private User user;
	private Person person;
	private Image image;
	private SearchResult<Image> allImages;
	private ListModel<Image> listModel;
	private UserProfileInfo profileInfo;
	
	public int getImagePages() {
		getAllImages();
		return allImages.getTotalCount();
	}
	
	public List<Image> getAllImages() {
		if (allImages!=null) return allImages.getResult();
		this.loadUser();
		int page = getRequest().getInt("page");
		User user = getModel().getUser(getUsersName());
		Query<Image> query = Query.of(Image.class).withPriviledged(user).orderByCreated().withPaging(page, 24);
		SearchResult<Image> search = getModel().search(query);
		allImages = search;
		return allImages.getResult();
	}
	
	public ListModel<Image> getLatestImages() {
		this.loadUser();
		ListModel<Image> model = new ListModel<Image>() {
			@Override
			public ListModelResult<Image> getResult() {
				User user = getModel().getUser(getUsersName());
				Query<Image> query = Query.of(Image.class).withPriviledged(user).orderByCreated().withPaging(0, getPageSize()).descending();
				SearchResult<Image> search = getModel().search(query);
				return new ListModelResult<Image>(search.getResult(),search.getTotalCount());
			}
		};
		model.setPageSize(12);
		return model;
	}
	
	public ListModel<Image> getImageList() {
		this.loadUser();
		if (listModel!=null) return listModel;
		ListModel<Image> model = new ListModel<Image>() {

			@Override
			public ListModelResult<Image> getResult() {
				User user = getModel().getUser(getUsersName());
				Query<Image> query = Query.of(Image.class).withPriviledged(user).orderByCreated().withPaging(getPage(), getPageSize()).descending();
				SearchResult<Image> search = getModel().search(query);
				return new ListModelResult<Image>(search.getResult(),search.getTotalCount());
			}
			
		};
		model.setPageSize(24);
		listModel = model;
		return model;
	}
	
	private String getUsersName() {
		return getRequest().getLocalPath()[0];
	}
	
	public User getUser() {
		loadUser();
		return user;
	}
	
	public UserProfileInfo getInfo() throws ModelException {
		if (profileInfo==null)
			this.profileInfo = UserProfileInfoUtil.build(getPerson(),getRequest().getSession());
		return this.profileInfo;
	}
	
	public Person getPerson() {
		loadUser();
		return person;
	}
	
	public Image getImage() {
		loadUser();
		return image;
	}
	
	public boolean getCanEdit() {
		return getRequest().getSession().getUser().getUsername().equals(getUsersName());
	}
	
	private void loadUser() {
		if (user==null || person==null) {
			UserQuery query = new UserQuery().withUsername(getUsersName());
			PairSearchResult<User,Person> result = getModel().searchPairs(query);
			Pair<User, Person> next = result.iterator().next();
			user = next.getKey();
			person = next.getValue();
			try {
				image = getModel().getChild(user, Relation.KIND_SYSTEM_USER_IMAGE, Image.class);
			} catch (ModelException e) {
				// TODO: Do something usefull
			}
		}
	}
}
