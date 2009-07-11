package dk.in2isoft.onlineobjects.apps.community.services;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.model.util.WebModelUtil;
import dk.in2isoft.onlineobjects.util.ValidationUtil;

public class MemberService {
	
	private ModelService modelService;

	public void validateNewMember(String username, String password) throws IllegalRequestException {
		if (!StringUtils.isNotBlank(username)) {
			throw new IllegalRequestException("Username is not provided","noUsername");
		}
		if (!ValidationUtil.isValidUsername(username)) {
			throw new IllegalRequestException("Username contains invalid characters","invalidUsername");
		}
		if (!LangUtil.isDefined(password)) {
			throw new IllegalRequestException("Password is not provided","noPassword");
		}
	}

	public void validateNewMember(String username, String password, String fullName, String email) throws IllegalRequestException {
		validateNewMember(username, password);
		if (!LangUtil.isDefined(fullName)) {
			throw new IllegalRequestException("Name is not provided","noName");
		}
		if (!LangUtil.isDefined(email)) {
			throw new IllegalRequestException("Email is not provided","noEmail");
		}
		if (!ValidationUtil.isWellFormedEmail(email)) {
			throw new IllegalRequestException("The email address is invalid","invalidEmail");
		}
	}

	public User signUp(UserSession session, String username, String password, String fullName, String email) throws EndUserException {

		validateNewMember(username, password, fullName, email);
		
		User existing = modelService.getUser(username);
		if (existing != null) {
			throw new EndUserException("The user allready exists","userExists");
		}

		// Create a user
		User user = new User();
		user.setUsername(username);
		user.setPassword(password);
		modelService.createItem(user, session);

		// TODO: Replace with service
		Core.getInstance().getSecurity().changeUser(session, username, password);

		// Create a person
		Person person = new Person();
		person.setFullName(fullName);
		modelService.createItem(person, session);
		
		// Create email
		EmailAddress emailAddress = new EmailAddress();
		emailAddress.setAddress(email);
		modelService.createItem(emailAddress, session);
		
		// Create relation between person and email
		modelService.createRelation(person, emailAddress, session);

		// Create relation between user and person
		modelService.createRelation(user, person, Relation.KIND_SYSTEM_USER_SELF, session);

		// Create a web site
		WebSite site = new WebSite();
		site.setName(buildWebSiteTitle(fullName));
		modelService.createItem(site, session);

		// Create relation between user and web site
		modelService.createRelation(user, site,session);

		WebModelUtil.createWebPageOnSite(site.getId(),ImageGallery.class, session);
		
		return user;
	}
	
	private String buildWebSiteTitle(String fullName) {
		fullName = fullName.trim();
		if (fullName.endsWith("s")) {
			fullName+="'";
		} else {
			fullName+="'s";			
		}
		return fullName+" hjemmeside";
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

}
