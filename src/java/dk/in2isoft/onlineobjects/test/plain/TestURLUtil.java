package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import dk.in2isoft.commons.http.URLUtil;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestURLUtil extends AbstractTestCase {
		
	@Test
	public void testValidation() {
		assertTrue(URLUtil.isValidHttpUrl("http://www.youtube.com/watch?v=ngQjsJPEqag&feature=rec-LGOUT-farside_rev-rn-2r-1-HM"));
		assertFalse(URLUtil.isValidHttpUrl("https://www.youtube.com/watch?v=ngQjsJPEqag&feature=rec-LGOUT-farside_rev-rn-2r-1-HM"));
	}
	
}
