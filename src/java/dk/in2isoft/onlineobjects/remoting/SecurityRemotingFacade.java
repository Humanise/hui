package dk.in2isoft.onlineobjects.remoting;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class SecurityRemotingFacade extends AbstractRemotingFacade {

	public boolean changeUser(String username, String password) throws EndUserException {
		if (username == null || username.length() == 0) {
			throw new IllegalArgumentException("Username must have a length!");
		}
		if (password == null || password.length() == 0) {
			throw new IllegalArgumentException("Password must have a length!");
		}
		return Core.getInstance().getSecurity().changeUser(getUserSession(), username, password);
	}

	public boolean logOut() throws EndUserException {
		return Core.getInstance().getSecurity().logOut(getUserSession());
	}

	public User getUser() {
		return getUserSession().getUser();
	}

	public Person getUsersPerson() throws ModelException {
		User user = getUserSession().getUser();
		Entity person = getModel().getChild(user, Person.class);
		return (Person) person;
	}
}
