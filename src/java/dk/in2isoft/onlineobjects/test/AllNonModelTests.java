package dk.in2isoft.onlineobjects.test;

import junit.framework.Test;
import junit.framework.TestSuite;

public class AllNonModelTests {

	public static Test suite() {
		TestSuite suite = new TestSuite("Test for dk.in2isoft.onlineobjects.test");
		//$JUnit-BEGIN$
		suite.addTestSuite(TestToolController.class);
		suite.addTestSuite(TestRegExp.class);
		suite.addTestSuite(TestConversionFacade.class);
		suite.addTestSuite(TestEntityReflection.class);
		suite.addTestSuite(TestLangUtil.class);
		//$JUnit-END$
		return suite;
	}

}
