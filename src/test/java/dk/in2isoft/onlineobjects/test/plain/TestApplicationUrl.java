package dk.in2isoft.onlineobjects.test.plain;

import java.util.Collection;

import junit.framework.TestCase;
import dk.in2isoft.onlineobjects.model.Application;
import dk.in2isoft.onlineobjects.model.Property;

public class TestApplicationUrl extends TestCase {
	
	public void test() {
		
		Application app = new Application();
		app.addProperty(Application.PROPERTY_URL_MAPPING, "http://[a-z0-9_\\.]*jojo\\.dk:9090.*");
		app.addProperty(Application.PROPERTY_URL_MAPPING, "jojo\\.dk");
		app.addProperty(Application.PROPERTY_URL_MAPPING, "onlineobjects\\.com/.*");
		assertTrue(matches("http://jojo.dk:9090/test/css/base.css", app));
		assertTrue(matches("http://jbm.jojo.dk:9090", app));
		
		assertFalse(matches("http://jojo.dk:8080/test/css/base.css", app));
	}
	
	private boolean matches(String url,Application app) {
		Collection<Property> properties = app.getProperties(Application.PROPERTY_URL_MAPPING);
		for (Property property : properties) {
			String value = property.getValue();
			if (url.matches(value)) {
				return true;
			}
		}
		return false;
	}
}
