package dk.in2isoft.onlineobjects.test;

import java.util.HashMap;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.EmailService;

public class TestVelocity extends SpringTestCase {
		
	public void testVelocity() throws EndUserException {
		ConfigurationService config = getBean(ConfigurationService.class);
		Map<String, Object> model = new HashMap<String, Object>();
        model.put("invited-name", "Jonas Munk");
        model.put("inviter-name", "John Andersen");
        model.put("inviter-url", "John Andersen");
        model.put("url", "http://www.in2isoft.dk/");
        model.put("base-url", config.getBaseUrl());
        EmailService emailService = getBean(EmailService.class);
        String html = emailService.applyTemplate("dk/in2isoft/onlineobjects/apps/community/resources/invitation-template.html", model);
        assertTrue(html.contains("Jonas Munk"));
		emailService.sendHtmlMessage("Test HTML",html,"jonasmunk@me.com","Jonas Munk");
	}
}