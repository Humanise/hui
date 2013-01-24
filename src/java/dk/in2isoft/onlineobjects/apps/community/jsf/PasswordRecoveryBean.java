package dk.in2isoft.onlineobjects.apps.community.jsf;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.model.User;


public class PasswordRecoveryBean extends AbstractManagedBean implements InitializingBean {
	
	private User user;
	private ModelService modelService;
	
	public void afterPropertiesSet() throws Exception {
		SearchResult<User> result = modelService.search(Query.of(User.class).withCustomProperty(User.PASSWORD_RECOVERY_CODE_PROPERTY, getKey()));
		user = result.getFirst();
	}
	
	public String getKey() {
		return getRequest().getString("key");
	}
	
	public User getUser() {
		return user;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
