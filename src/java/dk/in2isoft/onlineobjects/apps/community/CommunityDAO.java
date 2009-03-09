package dk.in2isoft.onlineobjects.apps.community;

import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.AbstractDAO;
import dk.in2isoft.onlineobjects.core.Configuration;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.EntitylistSynchronizer;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Invitation;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
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
		Person person = (Person) model.getChild(invitation, Person.class);
		if (person == null) {
			throw new EndUserException("The invitation does not have a person associated");
		}
		EmailAddress mail = (EmailAddress) model.getChild(person, EmailAddress.class);
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
					+ "Du er blevet inviteret til at blive bruger af OnlineObjects. Klik på følgende link: http://"
					+ config.getBaseUrl() + "/invitation?code=" + invitation.getCode());
			email.send();
		} catch (EmailException e) {
			throw new EndUserException(e);
		}
	}
	
	public void sendFeedback(String emailAddress,String message) throws EndUserException {

		Configuration config = Core.getInstance().getConfiguration();
		try {
			SimpleEmail email = new SimpleEmail();
			email.setHostName(config.getMailHost());
			email.setAuthentication(config.getMailUsername(), config.getMailPassword());
			email.addTo("jonasmunk@mac.com", "Jonas Munk");
			email.setFrom("jonasmunk@mac.com", "Jonas Munk");
			email.setSubject("OnlineObjects feedback");
			email.setMsg("Email: "+emailAddress+"\n\n"+message);
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

		Query<Invitation> query = new Query<Invitation>(Invitation.class).withFieldValue(Invitation.FIELD_CODE, code);
		List<Invitation> invitations = getModel().list(query);
		if (invitations.size() == 0) {
			throw new EndUserException("Could not find invitation with code: " + code);
		}
		Invitation invitation = invitations.get(0);
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
		Person person = (Person) getModel().getChild(invitation, Person.class);
		Person newPerson = new Person();

		// Create copy of person
		newPerson.setGivenName(person.getGivenName());
		newPerson.setFamilyName(person.getFamilyName());
		getModel().createItem(newPerson, session);

		EmailAddress mail = (EmailAddress) getModel().getChild(person, EmailAddress.class);

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

	public void signUp(UserSession session, String username, String password, String fullName, String email) throws EndUserException {

		if (!LangUtil.isDefined(username)) {
			throw new IllegalRequestException("Username is not provided","noUsername");
		}
		if (!StringUtils.containsOnly(username, "abcdefghijklmnopqrstuvwxyz0123456789")) {
			throw new IllegalRequestException("Username contains invalid characters","invalidUsername");
		}
		if (!LangUtil.isDefined(password)) {
			throw new IllegalRequestException("Password is not provided","noPassword");
		}
		if (!LangUtil.isDefined(fullName)) {
			throw new IllegalRequestException("Name is not provided","noName");
		}
		if (!LangUtil.isDefined(email)) {
			throw new IllegalRequestException("Email is not provided","noEmail");
		}
		if (!LangUtil.isWellFormedEmail(email)) {
			throw new IllegalRequestException("The email address is invalid","invalidEmail");
		}
		ModelFacade model = getModel();
		User existing = model.getUser(username);
		if (existing != null) {
			throw new EndUserException("User allready exists","userExists");
		}

		// Create a user
		User user = new User();
		user.setUsername(username);
		user.setPassword(password);
		model.createItem(user, session);

		Core.getInstance().getSecurity().changeUser(session, username, password);

		// Create a person
		Person person = new Person();
		person.setFullName(fullName);
		model.createItem(person, session);
		
		// Create email
		EmailAddress emailAddress = new EmailAddress();
		emailAddress.setAddress(email);
		model.createItem(emailAddress, session);
		
		// Create relation between person and email
		model.createRelation(person, emailAddress, session);

		// Create relation between user and person
		model.createRelation(user, person, Relation.KIND_SYSTEM_USER_SELF, session);

		// Create a web site
		WebSite site = new WebSite();
		site.setName(buildWebSiteTitle(fullName));
		model.createItem(site, session);

		// Create relation between user and web site
		model.createRelation(user, site,session);

		WebModelUtil.createWebPageOnSite(site.getId(),ImageGallery.class, session);
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

	
	public void updateDummyEmailAddresses(Entity parent,List<EmailAddress> addresses, Priviledged session) throws EndUserException {
		
		// Remove empty addresses
		for (Iterator<EmailAddress> i = addresses.iterator(); i.hasNext();) {
			EmailAddress emailAddress = i.next();
			if (!LangUtil.isDefined(emailAddress.getAddress())) {
				i.remove();
			}
		}
		
		List<EmailAddress> existing = getModel().getChildren(parent, EmailAddress.class);
		EntitylistSynchronizer<EmailAddress> sync = new EntitylistSynchronizer<EmailAddress>(existing,addresses);
		
		for (Entry<EmailAddress, EmailAddress> entry : sync.getUpdated().entrySet()) {
			EmailAddress original = entry.getKey();
			EmailAddress dummy = entry.getValue();
			original.setAddress(dummy.getAddress());
			original.setContext(dummy.getContext());
		}
		
		for (EmailAddress emailAddress : sync.getNew()) {
			getModel().createItem(emailAddress, session);
			getModel().createRelation(parent, emailAddress, session);
		}
		
		for (EmailAddress emailAddress : sync.getDeleted()) {
			getModel().deleteEntity(emailAddress, session);
		}
	}

	
	public void updateDummyPhoneNumbers(Entity parent,List<PhoneNumber> phones, Priviledged priviledged) throws EndUserException {

		// Remove empty addresses
		for (Iterator<PhoneNumber> i = phones.iterator(); i.hasNext();) {
			PhoneNumber number = i.next();
			if (!LangUtil.isDefined(number.getNumber())) {
				i.remove();
			}
		}
		List<PhoneNumber> existing = getModel().getChildren(parent, PhoneNumber.class);
		EntitylistSynchronizer<PhoneNumber> sync = new EntitylistSynchronizer<PhoneNumber>(existing,phones);
		
		for (Entry<PhoneNumber, PhoneNumber> entry : sync.getUpdated().entrySet()) {
			PhoneNumber original = entry.getKey();
			PhoneNumber dummy = entry.getValue();
			original.setNumber(dummy.getNumber());
			original.setContext(dummy.getContext());
		}
		
		for (PhoneNumber number : sync.getNew()) {
			getModel().createItem(number, priviledged);
			getModel().createRelation(parent, number, priviledged);
		}
		
		for (PhoneNumber number : sync.getDeleted()) {
			getModel().deleteEntity(number, priviledged);
		}
	}

	public void updateDummyInternetAddresses(Entity parent, List<InternetAddress> urls, Priviledged priviledged) throws ModelException, SecurityException {

		// Remove empty addresses
		for (Iterator<InternetAddress> i = urls.iterator(); i.hasNext();) {
			InternetAddress address = i.next();
			if (!LangUtil.isDefined(address.getAddress())) {
				i.remove();
			}
		}
		List<InternetAddress> existing = getModel().getChildren(parent, InternetAddress.class);
		EntitylistSynchronizer<InternetAddress> sync = new EntitylistSynchronizer<InternetAddress>(existing,urls);
		
		for (Entry<InternetAddress, InternetAddress> entry : sync.getUpdated().entrySet()) {
			InternetAddress original = entry.getKey();
			InternetAddress dummy = entry.getValue();
			original.setAddress(dummy.getAddress());
			original.setContext(dummy.getContext());
		}
		
		for (InternetAddress number : sync.getNew()) {
			getModel().createItem(number, priviledged);
			getModel().createRelation(parent, number, priviledged);
		}
		
		for (InternetAddress number : sync.getDeleted()) {
			getModel().deleteEntity(number, priviledged);
		}
	}
}
