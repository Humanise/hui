package dk.in2isoft.onlineobjects.test;

import junit.framework.Test;
import junit.framework.TestSuite;

public class AllTests {

	public static Test suite() {
		TestSuite suite = new TestSuite("Test for dk.in2isoft.onlineobjects.test");
		//$JUnit-BEGIN$
		suite.addTestSuite(TestToolController.class);
		suite.addTestSuite(TestRegExp.class);
		suite.addTestSuite(TestConversionFacade.class);
		suite.addTestSuite(TestHibernate.class);
		suite.addTestSuite(TestEntityReflection.class);
		//$JUnit-END$
		return suite;
	}

}
