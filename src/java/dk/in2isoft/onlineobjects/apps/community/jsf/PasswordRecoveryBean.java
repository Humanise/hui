package dk.in2isoft.onlineobjects.apps.community.jsf;

import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.model.User;


public class PasswordRecoveryBean extends AbstractManagedBean {
	
	private User user;
	private boolean loaded;

	private void load() {
		if (loaded) return;
		SearchResult<User> result = getModel().search(Query.of(User.class).withCustomProperty(User.PASSWORD_RECOVERY_CODE_PROPERTY, getKey()));
		user = result.getFirst();
		loaded = true;
	}
	
	public String getKey() {
		return getRequest().getString("key");
	}
	
	public User getUser() {
		load();
		return user;
	}
}
