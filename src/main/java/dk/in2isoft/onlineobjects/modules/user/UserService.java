package dk.in2isoft.onlineobjects.modules.user;

import java.util.List;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;

public class UserService {
	
	private ModelService modelService;

	public List<UserInfo> list(UserQuery query) throws ModelException {
		PairSearchResult<User,Person> result = modelService.searchPairs(query);
		List<UserInfo> list = Lists.newArrayList();
		for (Pair<User, Person> pair : result.getList()) {
			UserInfo info = new UserInfo();
			info.setPerson(pair.getValue());
			info.setUser(pair.getKey());
			Image image = modelService.getChild(pair.getKey(), Image.class);
			info.setImage(image);
			list.add(info);
		}
		return list;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
