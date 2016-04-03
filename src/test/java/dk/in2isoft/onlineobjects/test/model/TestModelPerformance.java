package dk.in2isoft.onlineobjects.test.model;

import org.apache.commons.lang.time.StopWatch;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestModelPerformance extends AbstractSpringTestCase {

	@Autowired
	private SecurityService securityService;

	@Autowired
	private WordService wordService;
    	
	@Test
	public void testThis() throws EndUserException {
		
		Privileged admin = securityService.getAdminPrivileged();
		StopWatch watch = new StopWatch();
		watch.start();
		wordService.getSource("http://wordnet.princeton.edu", admin);
		watch.stop();
		System.out.println(watch.getTime());
	}
	
	public void setWordService(WordService wordService) {
		this.wordService = wordService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
