package dk.in2isoft.onlineobjects.test.traffic;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses( { 
	TestEmailService.class, 
	TestHtmlDocumentParser.class, 
	TestMail.class
})
public class AllTrafficTests {

}
