package dk.in2isoft.onlineobjects.test;

import java.lang.reflect.Field;

import dk.in2isoft.onlineobjects.model.ImageGallery;
import junit.framework.TestCase;

public class TestEntityReflection extends TestCase {

	
	public void testBasic() throws Exception {
		Field field = ImageGallery.class.getDeclaredField("TYPE");
		System.out.println(field.get(new ImageGallery()));
	}
}
