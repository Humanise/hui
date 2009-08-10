package dk.in2isoft.onlineobjects.apps.community.views;

import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.apps.community.services.InvitationService;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Invitation;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;


public class InvitationView extends AbstractManagedBean implements InitializingBean {
	
	private ModelService modelService;
	private InvitationService invitationService;
	
	private Invitation invitation;
	private User inviterUser;
	private Person inviterPerson;
	private Person person;
	private EmailAddress email;

	public void afterPropertiesSet() throws Exception {
		invitation = invitationService.getInvitation(getCode());
		if (invitation!=null) {
			inviterUser = modelService.getParent(invitation, User.class);
			inviterPerson = modelService.getChild(inviterUser, Person.class);
			person = modelService.getChild(invitation, Person.class);
			email = modelService.getChild(person, EmailAddress.class);
		}
	}
	
	public String getFormattedMessage() {
		if (invitation !=null && invitation.getMessage()!=null) {
			return StringEscapeUtils.escapeHtml(invitation.getMessage()).replaceAll("\\n", "<br/>");
		}
		return null;
	}
	
	public String getNewUsername() {
		String givenName = person.getGivenName();
		if (givenName!=null) {
			return givenName.toLowerCase();
		}
		return "";
	}
	
	public Invitation getInvitation() {
		return invitation;
	}
	
	public Person getInviterPerson() {
		return inviterPerson;
	}
	
	public EmailAddress getEmail() {
		return email;
	}
	
	public Person getPerson() {
		return person;
	}
	
	public User getInviterUser() {
		return inviterUser;
	}
	
	public String getCode() {
		return getRequest().getString("code");
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setInvitationService(InvitationService invitationService) {
		this.invitationService = invitationService;
	}

	public InvitationService getInvitationService() {
		return invitationService;
	}
}
