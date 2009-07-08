package dk.in2isoft.onlineobjects.services;

import java.util.List;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;

public class PasswordRecoveryService {

	private EmailService emailService;
	private ModelService modelService;
	private ConfigurationService configurationService;
	
	public boolean sendRecoveryMail(String usernameOrEmail,Priviledged priviledged) throws EndUserException {
		User user = modelService.getUser(usernameOrEmail);
		if (user!=null) {
			return sendRecoveryMail(user,priviledged);
		} else {
			Query<EmailAddress> query = Query.of(EmailAddress.class).withFieldValue(EmailAddress.ADDRESS_PROPERTY, usernameOrEmail);
			List<EmailAddress> list = modelService.search(query).getResult();
			if (!list.isEmpty()) {
				if (list.size()>1) {
					return false;
				} else {
					EmailAddress emailAddress = list.get(0);
					Person person = modelService.getParent(emailAddress, Person.class);
					if (person!=null) {
						User emailUser = modelService.getParent(person, User.class);
						if (emailUser!=null) {
							return sendRecoveryMail(emailUser, emailAddress, priviledged);
						}
					}
				}
			}
		}
		return false;
	}
	
	public boolean sendRecoveryMail(User user,Priviledged priviledged) throws EndUserException {
		Person person = modelService.getChild(user, Person.class);
		if (person!=null) {
			EmailAddress email = modelService.getChild(person, EmailAddress.class);
			if (email!=null) {
				return sendRecoveryMail(user, email,priviledged);
			}
		}
		return false;
	}
	
	public boolean sendRecoveryMail(User user, EmailAddress email,Priviledged priviledged) throws EndUserException {
		StringBuilder body = new StringBuilder();
		String random = LangUtil.generateRandomString(30);
		user.overrideFirstProperty(User.PASSWORD_RECOVERY_CODE_PROPERTY, random);
		// TODO: Priviledged should be from session
		modelService.updateItem(user, priviledged);
		body.append("http://").append(configurationService.getBaseUrl());
		body.append("/recoverpassword.html?key=");
		body.append(random);
		emailService.sendMessage("OnlineObjects password recovery", body.toString(), email.getAddress());
		return true;
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
}
