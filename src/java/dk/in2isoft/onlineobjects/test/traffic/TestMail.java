package dk.in2isoft.onlineobjects.test.traffic;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;
import org.junit.Test;

import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestMail extends AbstractTestCase {

	@Test
	public void testSimpleMail() throws EmailException {
		SimpleEmail email = new SimpleEmail();
		email.setHostName("smtp.mac.com");
		email.setAuthentication("jonasmunk", "0holger+");
		email.addTo("jonasmunk@mac.com", "Jonas Munk");
		email.setFrom("jonasmunk@mac.com", "Jonas Munk");
		email.setSubject("Test message");
		email.setMsg("This is a simple test of commons-email");
		email.send();
	}
}
