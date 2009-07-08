package dk.in2isoft.onlineobjects.test;

import junit.framework.TestCase;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.PasswordRecoveryService;

public class TestSpring extends TestCase {

	public void testSpring() throws EndUserException {
		ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
		PasswordRecoveryService service = (PasswordRecoveryService) context.getBean("passwordRecoveryService",PasswordRecoveryService.class);
		ModelService modelService = (ModelService) context.getBean("modelService", ModelService.class);
		User admin = modelService.getUser("admin");
		boolean success = service.sendRecoveryMail("jonasmunk@mac.com",admin);
		assertTrue(success);
		boolean success2 = service.sendRecoveryMail("jonas",admin);
		assertTrue(success2);
	}
}
