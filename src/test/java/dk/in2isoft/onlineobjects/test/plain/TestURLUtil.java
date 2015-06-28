package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Assert;
import org.junit.Test;

import dk.in2isoft.commons.http.URLUtil;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestURLUtil extends AbstractSpringTestCase {
		
	@Test
	public void testValidation() {
		assertTrue(URLUtil.isValidHttpUrl("http://www.youtube.com/watch?v=ngQjsJPEqag&feature=rec-LGOUT-farside_rev-rn-2r-1-HM"));
		assertFalse(URLUtil.isValidHttpUrl("https://www.youtube.com/watch?v=ngQjsJPEqag&feature=rec-LGOUT-farside_rev-rn-2r-1-HM"));
	}
	
	@Test
	public void testToName() {
		
		
		Assert.assertEquals("Red Flower", URLUtil.toFileName("http://upload.wikimedia.org/wikipedia/commons/3/31/Red_Flower.png"));
		Assert.assertEquals("Oceans Clownfish", URLUtil.toFileName("http://www.okeanosgroup.com/blog/wp-content/uploads/2012/06/Oceans-Clownfish.jpg"));
		
	}
	
}
