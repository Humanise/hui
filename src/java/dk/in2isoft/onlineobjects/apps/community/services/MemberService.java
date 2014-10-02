package dk.in2isoft.onlineobjects.apps.community.services;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.services.WebModelService;
import dk.in2isoft.onlineobjects.util.ValidationUtil;

public class MemberService {
	
	private ModelService modelService;
	private WebModelService webModelService;
	private SecurityService securityService;

	public void validateNewMember(String username, String password) throws IllegalRequestException {
		if (!StringUtils.isNotBlank(username)) {
			throw new IllegalRequestException("Username is not provided","noUsername");
		}
		if (!ValidationUtil.isValidUsername(username)) {
			throw new IllegalRequestException("Username contains invalid characters","invalidUsername");
		}
		if (!Strings.isNotBlank(password)) {
			throw new IllegalRequestException("Password is not provided","noPassword");
		}
		if (!ValidationUtil.isValidPassword(password)) {
			throw new IllegalRequestException("Password is not valid","invalidPassword");
		}
	}

	public void validateNewMember(String username, String password, String fullName, String email) throws IllegalRequestException {
		validateNewMember(username, password);
		if (!Strings.isNotBlank(fullName)) {
			throw new IllegalRequestException("Name is not provided","noName");
		}
		if (!Strings.isNotBlank(email)) {
			throw new IllegalRequestException("Email is not provided","noEmail");
		}
		if (!ValidationUtil.isWellFormedEmail(email)) {
			throw new IllegalRequestException("The email address is invalid","invalidEmail");
		}
	}

	public Image getUsersProfilePhoto(User user) throws ModelException {
		return modelService.getChild(user, Relation.KIND_SYSTEM_USER_IMAGE, Image.class);
	}
	
	public Person getUsersPerson(User user) throws ModelException {
		return modelService.getChild(user, Relation.KIND_SYSTEM_USER_SELF, Person.class);
	}


	public User signUp(UserSession session, String username, String password, String fullName, String email) throws EndUserException {

		User user = createMember(session, username, password, fullName, email);

		securityService.changeUser(session, username, password);

		return user;
	}

	public User createMember(UserSession session, String username,
			String password, String fullName, String email)
			throws IllegalRequestException, EndUserException, ModelException {
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

		// Create a person
		Person person = new Person();
		person.setFullName(fullName);
		modelService.createItem(person, user);
		
		// Create email
		EmailAddress emailAddress = new EmailAddress();
		emailAddress.setAddress(email);
		modelService.createItem(emailAddress, user);
		
		// Create relation between person and email
		modelService.createRelation(person, emailAddress, user);

		// Create relation between user and person
		modelService.createRelation(user, person, Relation.KIND_SYSTEM_USER_SELF, user);

		// Create a web site
		WebSite site = new WebSite();
		site.setName(buildWebSiteTitle(fullName));
		modelService.createItem(site, user);
		securityService.grantPublicPrivileges(site, true, false, false);

		// Create relation between user and web site
		modelService.createRelation(user, site,user);

		webModelService.createWebPageOnSite(site.getId(),ImageGallery.class, user);
		return user;
	}

	/**
	 * Will create, update or delete the primary email address
	 * @param user
	 * @param email
	 * @param privileged
	 * @throws ModelException
	 * @throws SecurityException
	 * @throws IllegalRequestException 
	 */
	public void changePrimaryEmail(User user, String email, Privileged privileged) throws ModelException, SecurityException, IllegalRequestException {
		EmailAddress emailAddress = modelService.getChild(user, Relation.KIND_SYSTEM_USER_EMAIL, EmailAddress.class);
		if (StringUtils.isBlank(email)) {
			if (emailAddress!=null) {
				modelService.deleteEntity(emailAddress, privileged);
			}
			return;
		}
		email = email.trim();
		if (!ValidationUtil.isWellFormedEmail(email)) {
			throw new IllegalRequestException("The email is not well formed: "+email);
		}
		if (emailAddress!=null) {
			emailAddress.setAddress(email);
			emailAddress.setName(email);
			modelService.updateItem(emailAddress, privileged);
		} else {
			emailAddress = new EmailAddress();
			emailAddress.setAddress(email);
			emailAddress.setName(email);
			modelService.createItem(emailAddress, privileged);
			modelService.createRelation(user, emailAddress, Relation.KIND_SYSTEM_USER_EMAIL, privileged);
		}
	}
	
	/**
	 * TODO: Optimize this
	 * @param email
	 * @param privileged
	 * @return
	 * @throws ModelException
	 */
	public User getUserByPrimaryEmail(String email, Privileged privileged) throws ModelException {
		Query<EmailAddress> query = Query.after(EmailAddress.class).withField(EmailAddress.ADDRESS_PROPERTY, email).orderByCreated();
		
		List<EmailAddress> list = modelService.list(query);
		for (EmailAddress emailAddress : list) {
			User user = modelService.getParent(emailAddress, Relation.KIND_SYSTEM_USER_EMAIL, User.class);
			if (user!=null) {
				return user;
			}
		}
		return null;
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

	public void setWebModelService(WebModelService webModelService) {
		this.webModelService = webModelService;
	}

	public WebModelService getWebModelService() {
		return webModelService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}

}
