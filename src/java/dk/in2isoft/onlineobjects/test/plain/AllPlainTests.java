package dk.in2isoft.onlineobjects.test.plain;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

import dk.in2isoft.onlineobjects.test.plain.TestApplicationUrl;
import dk.in2isoft.onlineobjects.test.plain.TestFileService;
import dk.in2isoft.onlineobjects.test.plain.TestRegExp;
import dk.in2isoft.onlineobjects.test.plain.TestRestUtil;

@RunWith(Suite.class)
@Suite.SuiteClasses( { 
	TestApplicationUrl.class, 
	TestFileService.class, 
	TestImageService.class, 
	TestIndexService.class, 
	TestRegExp.class, 
	TestRestUtil.class,
	TestLangUtil.class,
	TestGraphService.class,
	TestSemanticService.class
})
public class AllPlainTests {

}
