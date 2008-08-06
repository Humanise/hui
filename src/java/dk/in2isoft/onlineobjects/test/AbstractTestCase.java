package dk.in2isoft.onlineobjects.test;

import dk.in2isoft.onlineobjects.core.Core;
import junit.framework.TestCase;

public class AbstractTestCase extends TestCase {

	@Override
	protected void setUp() throws Exception {
		Core.getInstance().start("/Users/jbm/Documents/workspace/OnlineObjectsAtGoogle/src/web/", null);
	}
}
