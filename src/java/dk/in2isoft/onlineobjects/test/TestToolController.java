package dk.in2isoft.onlineobjects.test;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationManager;
import dk.in2isoft.onlineobjects.apps.setup.SetupController;
import junit.framework.TestCase;

public class TestToolController extends TestCase {

	
	public void testToolController() {
		ApplicationController c = ApplicationManager.getInstance().getToolController("setup");
		assertNotNull(c);
		assertTrue(c instanceof SetupController);
	}
}
