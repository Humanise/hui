package dk.in2isoft.onlineobjects.apps.community.jsf;

import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;

public class UsersBean extends AbstractManagedBean {
	
	public ListModel<Pair<User, Person>> getUserList() {
		ListModel<Pair<User, Person>> model = new ListModel<Pair<User, Person>>() {

			@Override
			public ListModelResult<Pair<User, Person>> getResult() {
				UserQuery query = new UserQuery().withPaging(getPage(), getPageSize());
				PairSearchResult<User, Person> search = getModel().searchPairs(query);
				return new ListModelResult<Pair<User, Person>>(search.getResult(),search.getTotalCount());
			}
			
		};
		model.setPageSize(24);
		return model;
	}
}
