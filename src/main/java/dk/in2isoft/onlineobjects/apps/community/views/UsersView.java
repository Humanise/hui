package dk.in2isoft.onlineobjects.apps.community.views;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;

public class UsersView extends AbstractManagedBean implements InitializingBean {

	private ModelService modelService;

	private ListModel<UserInfo> model;

	public void afterPropertiesSet() throws Exception {
		model = new ListModel<UserInfo>() {
			@Override
			public ListModelResult<UserInfo> getResult() {
				UserQuery query = new UserQuery().withPaging(getPage(), getPageSize()).withPublicView();
				PairSearchResult<User, Person> search = modelService.searchPairs(query);
				return new ListModelResult<UserInfo>(convert(search.getList()),search.getTotalCount());
			}
			
		};
		model.setPageSize(24);
	}
	
	private List<UserInfo> convert(List<Pair<User,Person>> list) {
		List<UserInfo> result = new ArrayList<UserInfo>();
		for (Pair<User, Person> pair : list) {
			UserInfo info = new UserInfo();
			info.setPerson(pair.getValue());
			info.setUser(pair.getKey());
			try {
				info.setImage(modelService.getChild(pair.getKey(), Image.class));
			} catch (ModelException ignore) {}
			result.add(info);
		}
		return result;
	}
	
	public ListModel<UserInfo> getUserList() {
		return model;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}
}
