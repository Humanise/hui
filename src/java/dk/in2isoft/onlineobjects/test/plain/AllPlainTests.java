package dk.in2isoft.onlineobjects.test.plain;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses( { 
	TestApplicationUrl.class, 
	TestFileService.class, 
	TestImageService.class,
	TestRegExp.class, 
	TestRestUtil.class,
	TestLangUtil.class,
	TestGraphService.class,
	TestSemanticService.class
})
public class AllPlainTests {

}
