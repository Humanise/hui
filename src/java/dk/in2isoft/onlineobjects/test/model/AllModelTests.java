package dk.in2isoft.onlineobjects.test.model;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses( { 
	TestPerson.class, 
	TestRelations.class, 
	TestUserQuery.class, 
	TestIndexService.class
})
public class AllModelTests {

}
