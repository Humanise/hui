package dk.in2isoft.onlineobjects.apps.community;

import java.util.List;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.AbstractDAO;
import dk.in2isoft.onlineobjects.core.AbstractModelQuery;
import dk.in2isoft.onlineobjects.core.Configuration;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.SimpleModelQuery;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Invitation;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.model.util.WebModelUtil;

public class CommunityDAO extends AbstractDAO {

	Invitation createInvitation(UserSession session, Person invited, String message) throws ModelException {
		ModelFacade model = Core.getInstance().getModel();
		User user = session.getUser();

		Invitation invitation = new Invitation();
		invitation.setCode(LangUtil.generateRandomString(40));
		invitation.setMessage(message);
		model.createItem(invitation, session);

		// Create relation from user to invitation
		Relation userInvitation = new Relation(user, invitation);
		userInvitation.setKind(Relation.KIND_INIVATION_INVITER);
		model.createItem(userInvitation, session);

		// Create relation from invitation to person
		Relation invitationPerson = new Relation(invitation, invited);
		invitationPerson.setKind(Relation.KIND_INIVATION_INVITED);
		model.createItem(invitationPerson, session);

		return invitation;
	}

	public void sendInvitation(Invitation invitation) throws EndUserException {
		ModelFacade model = Core.getInstance().getModel();
		Person person = (Person) model.getFirstSubEntity(invitation, Person.class);
		if (person == null) {
			throw new EndUserException("The invitation does not have a person associated");
		}
		EmailAddress mail = (EmailAddress) model.getFirstSubEntity(person, EmailAddress.class);
		if (mail == null) {
			throw new EndUserException("The person does not have an email");
		}

		Configuration config = Core.getInstance().getConfiguration();
		try {
			SimpleEmail email = new SimpleEmail();
			email.setHostName(config.getMailHost());
			email.setAuthentication(config.getMailUsername(), config.getMailPassword());
			email.addTo(mail.getAddress(), person.getName());
			email.setFrom("jonasmunk@mac.com", "Jonas Munk");
			email.setSubject("Invitation til OnlineObjects");
			email.setMsg("Hej " + person.getName() + ".\n\n"
					+ "Du er blevet inviteret til at blive bruger af OnlineObjects. Klik p� f�lgende link: http://"
					+ config.getBaseUrl() + "/invitation?code=" + invitation.getCode());
			email.send();
		} catch (EmailException e) {
			throw new EndUserException(e);
		}
	}

	public void signUpFromInvitation(UserSession session, String code, String username, String password)
			throws EndUserException {
		if (username == null || username.length() == 0) {
			throw new IllegalRequestException("Username is null");
		}
		if (password == null || password.length() == 0) {
			throw new IllegalRequestException("Password is null");
		}

		AbstractModelQuery query = new SimpleModelQuery(Invitation.class).addLimitation(Invitation.FIELD_CODE, code);
		List<Item> invitations = getModel().search(query);
		if (invitations.size() == 0) {
			throw new EndUserException("Could not find invitation with code: " + code);
		}
		Invitation invitation = (Invitation) invitations.get(0);
		if (!Invitation.STATE_ACTIVE.equals(invitation.getState())) {
			throw new EndUserException("The invitation is not active. The state is: " + invitation.getState());
		}
		User user = getModel().getUser(username);
		if (user != null) {
			throw new EndUserException("A user already exists with username: " + username);
		}

		// Create a user
		user = new User();
		user.setUsername(username);
		user.setPassword(password);
		getModel().createItem(user, session);

		// Create relation between user and invitation
		Relation invitaionUserRelation = new Relation(invitation, user);
		invitaionUserRelation.setKind(Relation.KIND_INIVATION_INVITED);
		getModel().createItem(invitaionUserRelation, session);

		// Log in as new user
		Core.getInstance().getSecurity().changeUser(session, username, password);

		// Grant user access to self and relation
		getModel().grantFullPrivileges(user, session);
		getModel().grantFullPrivileges(invitaionUserRelation, session);

		// Get person from invitation
		Person person = (Person) getModel().getFirstSubEntity(invitation, Person.class);
		Person newPerson = new Person();

		// Create copy of person
		newPerson.setGivenName(person.getGivenName());
		newPerson.setFamilyName(person.getFamilyName());
		getModel().createItem(newPerson, session);

		EmailAddress mail = (EmailAddress) getModel().getFirstSubEntity(person, EmailAddress.class);

		// Create copy of mail
		EmailAddress newMail = new EmailAddress();
		newMail.setAddress(mail.getAddress());
		getModel().createItem(newMail, session);

		// Link copied person to copied mail
		Relation personMailRelation = new Relation(newPerson, newMail);
		getModel().createItem(personMailRelation, session);

		// Create relation between user and person
		Relation userPersonRelation = new Relation(user, newPerson);
		userPersonRelation.setKind(Relation.KIND_SYSTEM_USER_SELF);
		getModel().createItem(userPersonRelation, session);

		// Create a web site
		WebSite site = new WebSite();
		site.setName(person.getName());
		getModel().createItem(site, session);

		// Create relation between user and web site
		Relation userSiteRelation = new Relation(user, site);
		getModel().createItem(userSiteRelation, session);

		WebModelUtil.createWebPageOnSite(site.getId(), ImageGallery.class, session);

		// TODO: Is it OK to give the new user access to the invitation?
		getModel().grantFullPrivileges(invitation, session);
		// Set state of invitation to accepted
		invitation.setState(Invitation.STATE_ACCEPTED);
		getModel().updateItem(invitation, session);
	}

	public void signUp(UserSession session, String username, String password) throws EndUserException {

		if (username == null || username.length() == 0) {
			throw new IllegalRequestException("Username is null");
		}
		if (password == null || password.length() == 0) {
			throw new IllegalRequestException("Password is null");
		}
		ModelFacade model = getModel();
		User user = model.getUser(username);
		if (user != null) {
			throw new EndUserException("User allready exists");

		}

		// Create a user
		user = new User();
		user.setUsername(username);
		user.setPassword(password);
		model.createItem(user, session);

		Core.getInstance().getSecurity().changeUser(session, username, password);

		// Create a person
		Person person = new Person();
		person.setName(username);
		model.createItem(person, session);

		// Create relation between user and person
		Relation userPersonRelation = new Relation(user, person);
		userPersonRelation.setKind(Relation.KIND_SYSTEM_USER_SELF);
		model.createItem(userPersonRelation, session);

		// Create a web site
		WebSite site = new WebSite();
		site.setName(username);
		model.createItem(site, session);

		// Create relation between user and web site
		Relation userSiteRelation = new Relation(user, site);
		model.createItem(userSiteRelation, session);

		WebModelUtil.createWebPageOnSite(site.getId(),ImageGallery.class, session);

	}
}
