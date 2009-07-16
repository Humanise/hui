package dk.in2isoft.onlineobjects.remoting;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.PasswordRecoveryService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class SecurityRemotingFacade extends AbstractRemotingFacade {

	public boolean changeUser(String username, String password) throws EndUserException {
		if (!StringUtils.isNotBlank(username)) {
			throw new IllegalRequestException("Username is blank","usernameIsBlank");
		}
		if (!StringUtils.isNotBlank(password)) {
			throw new IllegalRequestException("Password is blank","passwordIsBlank");
		}
		return Core.getInstance().getSecurityService().changeUser(getUserSession(), username, password);
	}

	public boolean logOut() throws EndUserException {
		return Core.getInstance().getSecurityService().logOut(getUserSession());
	}

	public User getUser() {
		return getUserSession().getUser();
	}

	public Person getUsersPerson() throws ModelException {
		User user = getUserSession().getUser();
		Entity person = getModel().getChild(user, Person.class);
		return (Person) person;
	}
	
	public boolean recoverPassword(String usernameOrEmail) throws EndUserException {
		return getService(PasswordRecoveryService.class).sendRecoveryMail(usernameOrEmail,getUserSession());
	}
	
	public boolean changePassword(String key, String password) throws EndUserException {
		SearchResult<User> result = getModel().search(Query.of(User.class).withCustomProperty(User.PASSWORD_RECOVERY_CODE_PROPERTY, key));
		User user = result.getFirst();
		if (user!=null) {
			user.setPassword(password);
			user.removeProperties(User.PASSWORD_RECOVERY_CODE_PROPERTY);
			getModel().updateItem(user, user);
			return true;
		}
		return false;
	}
}
