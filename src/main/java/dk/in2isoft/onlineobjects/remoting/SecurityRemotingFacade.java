package dk.in2isoft.onlineobjects.remoting;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.PasswordRecoveryService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class SecurityRemotingFacade extends AbstractRemotingFacade {
	
	private PasswordRecoveryService passwordRecoveryService;
	private SecurityService securityService;

	public boolean changeUser(String username, String password) throws EndUserException {
		if (!StringUtils.isNotBlank(username)) {
			throw new IllegalRequestException("Username is blank","usernameIsBlank");
		}
		if (!StringUtils.isNotBlank(password)) {
			throw new IllegalRequestException("Password is blank","passwordIsBlank");
		}
		return securityService.changeUser(getUserSession(), username, password);
	}

	public boolean logOut() throws EndUserException {
		return securityService.logOut(getUserSession());
	}

	public User getUser() {
		return getUserSession().getUser();
	}

	public Person getUsersPerson() throws ModelException {
		User user = getUserSession().getUser();
		return modelService.getChild(user, Person.class);
	}
	
	public boolean recoverPassword(String usernameOrEmail) throws EndUserException {
		return getPasswordRecoveryService().sendRecoveryMail(usernameOrEmail,getUserSession());
	}
	
	public boolean changePassword(String key, String password) throws EndUserException {
		SearchResult<User> result = modelService.search(Query.of(User.class).withCustomProperty(User.PASSWORD_RECOVERY_CODE_PROPERTY, key));
		User user = result.getFirst();
		if (user!=null) {
			user.setPassword(password);
			user.removeProperties(User.PASSWORD_RECOVERY_CODE_PROPERTY);
			modelService.updateItem(user, user);
			return true;
		}
		return false;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}

	public void setPasswordRecoveryService(PasswordRecoveryService passwordRecoveryService) {
		this.passwordRecoveryService = passwordRecoveryService;
	}

	public PasswordRecoveryService getPasswordRecoveryService() {
		return passwordRecoveryService;
	}
}
