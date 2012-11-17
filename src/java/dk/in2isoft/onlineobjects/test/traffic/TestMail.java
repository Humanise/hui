package dk.in2isoft.onlineobjects.test.traffic;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;
import org.junit.Test;

import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestMail extends AbstractSpringTestCase {

	@Test
	public void testSimpleMail() throws EmailException {
		SimpleEmail email = new SimpleEmail();
		email.setHostName(getProperty("mail.hostname"));
		email.setAuthentication(getProperty("mail.user"), getProperty("mail.password"));
		email.addTo(getProperty("mail.address"), getProperty("mail.name"));
		email.setFrom(getProperty("mail.address"), getProperty("mail.name"));
		email.setSubject("Test message");
		email.setMsg("This is a simple test of commons-email");
		email.setSSL(true);
		email.send();
	}
}
