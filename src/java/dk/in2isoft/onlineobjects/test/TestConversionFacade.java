package dk.in2isoft.onlineobjects.test;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.conversion.EntityConverter;
import dk.in2isoft.onlineobjects.model.conversion.UserConverter;
import dk.in2isoft.onlineobjects.services.ConversionService;

public class TestConversionFacade extends AbstractTestCase {

	public void test() {
		ConversionService facade = Core.getInstance().getConversionService();
		EntityConverter converter = facade.getConverter(User.class);
		assertTrue(converter instanceof UserConverter);
	}
}
