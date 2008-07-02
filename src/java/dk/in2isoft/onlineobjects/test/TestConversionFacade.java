package dk.in2isoft.onlineobjects.test;

import junit.framework.TestCase;
import dk.in2isoft.onlineobjects.core.ConversionFacade;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.conversion.EntityConverter;
import dk.in2isoft.onlineobjects.model.conversion.UserConverter;

public class TestConversionFacade extends TestCase {
	
	@Override
	protected void setUp() throws Exception {
		super.setUp();
		Core.getInstance().start("/Users/jbm/Documents/workspace/OnlineObjectsAtGoogle/src/web/", null);
	}

	public void test() {
		ConversionFacade facade = Core.getInstance().getConverter();
		EntityConverter converter = facade.getConverter(User.class);
		assertTrue(converter instanceof UserConverter);
	}
}
