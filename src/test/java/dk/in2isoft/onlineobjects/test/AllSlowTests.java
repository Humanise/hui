package dk.in2isoft.onlineobjects.test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import dk.in2isoft.onlineobjects.test.traffic.TestComparison;
import dk.in2isoft.onlineobjects.test.traffic.TestEmailService;
import dk.in2isoft.onlineobjects.test.traffic.TestFeedComparison;
import dk.in2isoft.onlineobjects.test.traffic.TestFeedParsing;
import dk.in2isoft.onlineobjects.test.traffic.TestMail;
import dk.in2isoft.onlineobjects.test.traffic.TestRemoteDataService;

@RunWith(Suite.class)
@SuiteClasses({
	TestComparison.class,
	TestFeedComparison.class,
	TestFeedParsing.class,
	TestEmailService.class,
	TestMail.class,
	TestRemoteDataService.class
})

public class AllSlowTests {

}
