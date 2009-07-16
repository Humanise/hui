package dk.in2isoft.onlineobjects.test;

import junit.framework.TestCase;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.setup.SetupController;
import dk.in2isoft.onlineobjects.core.Core;

public class TestToolController extends TestCase {

	
	public void testToolController() {
		ApplicationController c = Core.getInstance().getApplicationService().getController("setup");
		assertNotNull(c);
		assertTrue(c instanceof SetupController);
	}
}
