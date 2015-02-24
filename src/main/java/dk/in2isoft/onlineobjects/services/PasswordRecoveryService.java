package dk.in2isoft.onlineobjects.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class PasswordRecoveryService {

	private EmailService emailService;
	private ModelService modelService;
	private ConfigurationService configurationService;
	
	public boolean sendRecoveryMail(String usernameOrEmail,Privileged priviledged) throws EndUserException {
		User user = modelService.getUser(usernameOrEmail);
		if (user!=null) {
			return sendRecoveryMail(user,priviledged);
		} else {
			Query<EmailAddress> query = Query.of(EmailAddress.class).withField(EmailAddress.ADDRESS_PROPERTY, usernameOrEmail);
			List<EmailAddress> list = modelService.search(query).getList();
			if (!list.isEmpty()) {
				if (list.size()>1) {
					return false;
				} else {
					EmailAddress emailAddress = list.get(0);
					Person person = modelService.getParent(emailAddress,Relation.KIND_SYSTEM_USER_EMAIL, Person.class);
					if (person!=null) {
						User emailUser = modelService.getParent(person, User.class);
						if (emailUser!=null) {
							return sendRecoveryMail(emailUser, person, emailAddress, priviledged);
						}
					}
				}
			}
		}
		return false;
	}
	
	public boolean sendRecoveryMail(User user,Privileged priviledged) throws EndUserException {
		Person person = modelService.getChild(user, Person.class);
		if (person!=null) {
			EmailAddress email = modelService.getChild(user,Relation.KIND_SYSTEM_USER_EMAIL, EmailAddress.class);
			if (email!=null) {
				return sendRecoveryMail(user, person, email,priviledged);
			}
		}
		return false;
	}
	
	public boolean sendRecoveryMail(User user, Person person, EmailAddress email,Privileged priviledged) throws EndUserException {
		String random = Strings.generateRandomString(30);
		user.overrideFirstProperty(User.PASSWORD_RECOVERY_CODE_PROPERTY, random);
		modelService.updateItem(user, priviledged);
		StringBuilder url = new StringBuilder();
		String context = configurationService.getApplicationContext("account");
		url.append(context);
		url.append("/en/password?key=");
		url.append(random);

		Map<String,Object> parms = new HashMap<String, Object>();
		parms.put("name", person.getFullName());
		parms.put("url",url.toString());
		parms.put("base-url", "http://" + configurationService.getBaseUrl());
		String html = emailService.applyTemplate("dk/in2isoft/onlineobjects/apps/account/resources/passwordrecovery-template.html", parms);
		
		emailService.sendHtmlMessage("Reset password for OnlineObjects", html, email.getAddress(),person.getName());
		return true;
	}

	public User getUserByRecoveryKey(String key) {

		SearchResult<User> result = modelService.search(Query.of(User.class).withCustomProperty(User.PASSWORD_RECOVERY_CODE_PROPERTY, key));
		return result.getFirst();
	}
	
	// Wiring...

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
}
