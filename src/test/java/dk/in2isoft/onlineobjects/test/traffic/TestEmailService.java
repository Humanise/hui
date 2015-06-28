package dk.in2isoft.onlineobjects.test.traffic;

import java.util.HashMap;
import java.util.Map;

import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.services.EmailService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

@Ignore
public class TestEmailService extends AbstractSpringTestCase {
	
	@Autowired
	private EmailService emailService;
		
	@Test
	public void testVelocity() throws EndUserException {
		Map<String, Object> model = new HashMap<String, Object>();
        model.put("invited-name", "Jonas Munk");
        model.put("inviter-name", "John Andersen");
        model.put("inviter-url", "John Andersen");
        model.put("url", "http://www.in2isoft.dk/");
        model.put("base-url", configurationService.getBaseUrl());
        String html = emailService.applyTemplate("dk/in2isoft/onlineobjects/apps/community/resources/invitation-template.html", model);
        Assert.assertTrue(html.contains("Jonas Munk"));
		emailService.sendHtmlMessage("Test HTML",html,"jonasmunk@me.com","Jonas Munk");
	}

	public void setEmailService(EmailService emailService) {
		this.emailService = emailService;
	}

	public EmailService getEmailService() {
		return emailService;
	}
}