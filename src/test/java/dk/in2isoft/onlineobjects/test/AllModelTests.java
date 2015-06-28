package dk.in2isoft.onlineobjects.test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import dk.in2isoft.onlineobjects.test.model.TestAdminUser;
import dk.in2isoft.onlineobjects.test.model.TestModelDirt;
import dk.in2isoft.onlineobjects.test.model.TestPerson;
import dk.in2isoft.onlineobjects.test.model.TestPublicAccessibility;
import dk.in2isoft.onlineobjects.test.model.TestQuery;
import dk.in2isoft.onlineobjects.test.model.TestRelations;
import dk.in2isoft.onlineobjects.test.model.TestUserQuery;
import dk.in2isoft.onlineobjects.test.model.TestWord;
import dk.in2isoft.onlineobjects.test.plain.TestImageService;

@RunWith(Suite.class)
@SuiteClasses({ TestAdminUser.class, TestImageService.class,
		TestModelDirt.class, TestPerson.class, TestPublicAccessibility.class,
		TestQuery.class, TestRelations.class, TestUserQuery.class, TestWord.class })
public class AllModelTests {

}
