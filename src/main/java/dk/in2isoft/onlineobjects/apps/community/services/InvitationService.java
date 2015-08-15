package dk.in2isoft.onlineobjects.apps.community.services;

import java.util.HashMap;
import java.util.Map;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Invitation;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.EmailService;


public class InvitationService {

	private ModelService modelService;
	private EmailService emailService;
	private ConfigurationService configurationService;
	private MemberService memberService;
	
	public Invitation getInvitation(String code) {
		Query<Invitation> query = new Query<Invitation>(Invitation.class).withField(Invitation.FIELD_CODE, code);
		return modelService.search(query).getFirst();
	}

	public Invitation createInvitation(UserSession session, Person invited, String message) throws ModelException {
		User user = session.getUser();

		Invitation invitation = new Invitation();
		invitation.setCode(Strings.generateRandomString(40));
		invitation.setMessage(message);
		modelService.createItem(invitation, session);

		// Create relation from user to invitation
		Relation userInvitation = new Relation(user, invitation);
		userInvitation.setKind(Relation.KIND_INIVATION_INVITER);
		modelService.createItem(userInvitation, session);

		// Create relation from invitation to person
		Relation invitationPerson = new Relation(invitation, invited);
		invitationPerson.setKind(Relation.KIND_INIVATION_INVITED);
		modelService.createItem(invitationPerson, session);

		return invitation;
	}

	public void sendInvitation(Invitation invitation) throws EndUserException {
		Person person = modelService.getChild(invitation, Person.class);
		User inviter = modelService.getParent(invitation, Relation.KIND_INIVATION_INVITER, User.class);
		Person inviterPerson = modelService.getChild(inviter, Relation.KIND_SYSTEM_USER_SELF, Person.class);
		if (person == null) {
			throw new EndUserException("The invitation does not have a person associated");
		}
		EmailAddress mail = modelService.getChild(person, EmailAddress.class);
		if (mail == null) {
			throw new EndUserException("The person does not have an email");
		}
		String inviterUrl = "http://"+ configurationService.getBaseUrl() + "/" + inviter.getUsername()+"/";
		String url = "http://"+ configurationService.getBaseUrl() + "/invitation.html?code=" + invitation.getCode();
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("invited-name", person.getName());
		parameters.put("inviter-name", inviterPerson!=null ? inviterPerson.getFullName() : "");
		parameters.put("inviter-url", inviterUrl);
		parameters.put("invite-url", url);
		parameters.put("base-url", configurationService.getBaseUrl());
        String html = emailService.applyTemplate("dk/in2isoft/onlineobjects/apps/community/resources/invitation-template.html", parameters);

		emailService.sendHtmlMessage("Invitation til OnlineMe", html, mail.getAddress(),person.getName());
	}

	public void signUpFromInvitation(UserSession session, String code,
			String username, String password) throws EndUserException {

		Invitation invitation = getInvitation(code);
		if (invitation == null) {
			throw new IllegalRequestException("Could not find invitation with code: " + code);
		}
		if (!Invitation.STATE_ACTIVE.equals(invitation.getState())) {
			throw new EndUserException("The invitation is not active. The state is: " + invitation.getState());
		}
		
		Person person = modelService.getChild(invitation, Person.class);
		EmailAddress email = modelService.getChild(person, EmailAddress.class);
		
		User newUser = memberService.signUp(session, username, password, person.getFullName(), email.getAddress());

		// Create relation between user and invitation
		Relation invitaionUserRelation = new Relation(invitation, newUser);
		invitaionUserRelation.setKind(Relation.KIND_INIVATION_INVITED);
		modelService.createItem(invitaionUserRelation, session);

		// TODO: Is it OK to give the new user access to the invitation?
		modelService.grantFullPrivileges(invitation, session);

		// Set state of invitation to accepted
		invitation.setState(Invitation.STATE_ACCEPTED);
		modelService.updateItem(invitation, session);
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setEmailService(EmailService emailService) {
		this.emailService = emailService;
	}

	public EmailService getEmailService() {
		return emailService;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}

	public MemberService getMemberService() {
		return memberService;
	}

}
