package dk.in2isoft.onlineobjects.apps.account.views;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.PasswordRecoveryService;

public class AccountPasswordView extends AbstractManagedBean implements InitializingBean {

	private PasswordRecoveryService passwordRecoveryService;

	private User user;

	private String key;
	
	private boolean found;
	
	public void afterPropertiesSet() throws Exception {
		
		key = getRequest().getString("key");
		if (Strings.isNotBlank(key)) {
			user = passwordRecoveryService.getUserByRecoveryKey(key);
			found = user!=null;
		}
	}
	
	public boolean isFound() {
		return found;
	}
	
	public User getUser() {
		return user;
	}
	
	public String getKey() {
		return key;
	}
	
	// Wiring...
	
	public void setPasswordRecoveryService(PasswordRecoveryService passwordRecoveryService) {
		this.passwordRecoveryService = passwordRecoveryService;
	}
}
