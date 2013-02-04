package dk.in2isoft.onlineobjects.apps.account.views;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class AccountSettingsView extends AbstractManagedBean implements InitializingBean {

	private ModelService modelService;
	
	private Person person;

	private User user;

	private EmailAddress email;

	private String primaryEmail;
	
	public void afterPropertiesSet() throws Exception {
		user = getRequest().getSession().getUser();
		
		person = modelService.getChild(user, Relation.KIND_SYSTEM_USER_SELF, Person.class);
		email = modelService.getChild(user, Relation.KIND_SYSTEM_USER_EMAIL, EmailAddress.class);
		if (email!=null) {
			primaryEmail = email.getAddress();
		}
	}
	
	public User getUser() {
		return user;
	}
	
	public Person getPerson() {
		return person;
	}
	
	public String getPrimaryEmail() {
		return primaryEmail;
	}
	
	// Wiring...

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
}
