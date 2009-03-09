package dk.in2isoft.onlineobjects.apps.community.jsf;

import java.util.List;

import javax.faces.model.ManagedBean;
import javax.faces.model.RequestScoped;

import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;

@ManagedBean(name = "base")
@RequestScoped
public class BaseBean extends AbstractManagedBean {
	
	public List<Image> getImages() {
		int page = getRequest().getInt("page");
		Query<Image> query = Query.of(Image.class).orderByCreated().withPaging(page, 20);
		SearchResult<Image> search = getModel().search(query);
		return search.getResult();
	}
	
	public List<Pair<User, Person>> getUsers() {
		UserQuery q = new UserQuery();
		PairSearchResult<User, Person> users = getModel().searchPairs(q);
		return users.getResult();
	}
}
