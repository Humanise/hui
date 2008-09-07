package dk.in2isoft.onlineobjects.test.model;

import junit.framework.Test;
import junit.framework.TestSuite;

public class ModelTests {

	public static Test suite() {
		TestSuite suite = new TestSuite("Test for dk.in2isoft.onlineobjects.test.model");
		//$JUnit-BEGIN$
		suite.addTestSuite(TestHibernate.class);
		suite.addTestSuite(TestRelations.class);
		//$JUnit-END$
		return suite;
	}

}
