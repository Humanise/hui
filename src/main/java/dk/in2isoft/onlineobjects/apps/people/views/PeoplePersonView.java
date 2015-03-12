package dk.in2isoft.onlineobjects.apps.people.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.community.UserProfileInfo;
import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.RemoteAccount;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.PersonService;
import dk.in2isoft.onlineobjects.services.RemoteDataService;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;
import dk.in2isoft.onlineobjects.util.remote.RemoteAccountInfo;

public class PeoplePersonView extends AbstractManagedBean implements InitializingBean {
	
	private PersonService personService;
	private ModelService modelService;
	private RemoteDataService remoteDataService;
	private SecurityService securityService;
	
	private User user;
	private Person person;
	private Image image;
	private ListModel<Image> listModel;
	private UserProfileInfo profileInfo;
	private ListModel<Image> latestImages;
	private List<RemoteAccountInfo> remoteAccountInfo;
	private boolean canModify;
	
	public void afterPropertiesSet() throws Exception {
		UserQuery query = new UserQuery().withUsername(getUsersName());
		PairSearchResult<User,Person> result = modelService.searchPairs(query);
		if (result.getTotalCount()==0) {
			return;
		}
		Pair<User, Person> next = result.iterator().next();
		user = next.getKey();
		person = next.getValue();
		canModify = securityService.canModify(person, getRequest().getSession());
		try {
			image = modelService.getChild(user, Relation.KIND_SYSTEM_USER_IMAGE, Image.class);
		} catch (ModelException e) {
			// TODO: Do something usefull
		}
	}
	
	public ListModel<Image> getLatestImages() {
		if (latestImages==null) {
			latestImages = new ListModel<Image>() {
				private ListModelResult<Image> result;
				
				@Override
				public ListModelResult<Image> getResult() {
					if (result!=null) return result;
					User user = modelService.getUser(getUsersName());
					Query<Image> query = Query.of(Image.class).withPrivileged(user).orderByCreated().withPaging(0, getPageSize()).descending();
					if (!canModify) {
						query.withPublicView();
					}
					SearchResult<Image> search = modelService.search(query);
					result = new ListModelResult<Image>(search.getList(),search.getList().size());
					return result;
				}
			};
			latestImages.setPageSize(16);
		}
		return latestImages;
	}
	
	public ListModel<Image> getImageList() {
		if (listModel!=null) return listModel;
		ListModel<Image> model = new ListModel<Image>() {

			@Override
			public ListModelResult<Image> getResult() {
				User user = modelService.getUser(getUsersName());
				Query<Image> query = Query.of(Image.class).withPrivileged(user).orderByCreated().withPaging(getPage(), getPageSize()).descending();
				if (!canModify) {
					query.withPublicView();
				}
				SearchResult<Image> search = modelService.search(query);
				return new ListModelResult<Image>(search.getList(),search.getTotalCount());
			}
			
		};
		model.setPageSize(24);
		listModel = model;
		return model;
	}
	
	private String getUsersName() {
		String[] path = getRequest().getLocalPath();
		if (path.length==2) {
			return path[1];
		}
		return path[0];
	}
	
	public User getUser() {
		return user;
	}
	
	public UserProfileInfo getInfo() throws ModelException {
		if (profileInfo==null) {
			this.profileInfo = personService.getProfileInfo(getPerson(),getRequest().getSession());
		}
		return this.profileInfo;
	}
	
	public Person getPerson() {
		return person;
	}
	
	public Image getImage() {
		return image;
	}
	
	public boolean isCanModify() {
		return canModify;
	}
	
	public boolean isFound() {
		return user!=null;
	}
	
	public List<RemoteAccountInfo> getRemoteAccountInfo() {
		if (remoteAccountInfo==null) {
			remoteAccountInfo = Lists.newArrayList();
			Query<RemoteAccount> query = Query.of(RemoteAccount.class).withPrivileged(user);
			List<RemoteAccount> accounts = modelService.list(query);
			for (RemoteAccount account : accounts) {
				remoteAccountInfo.add(remoteDataService.getInfo(account));
			}
		}
		return remoteAccountInfo;
	}

	public void setPersonService(PersonService personService) {
		this.personService = personService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setRemoteDataService(RemoteDataService remoteDataService) {
		this.remoteDataService = remoteDataService;
	}

	public RemoteDataService getRemoteDataService() {
		return remoteDataService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}
}
