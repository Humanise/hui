package dk.in2isoft.onlineobjects.test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

import dk.in2isoft.onlineobjects.test.model.AllModelTests;
import dk.in2isoft.onlineobjects.test.plain.AllPlainTests;
import dk.in2isoft.onlineobjects.test.traffic.AllTrafficTests;

@RunWith(Suite.class)
@Suite.SuiteClasses( { 
	AllTrafficTests.class,
	AllPlainTests.class,
	AllModelTests.class
})
public class AllTests {

}
