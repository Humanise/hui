package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import dk.in2isoft.commons.util.RegExpUtil;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestRegExpUtil extends AbstractSpringTestCase {
		
	@Test
	public void testValidation() {
		{
			String[] groups = RegExpUtil.getGroups("aaa123bbb", "[a-z]+([0-9]+)([a-z]+)");
			assertEquals("aaa123bbb", groups[0]);
			assertEquals("123", groups[1]);
			assertEquals("bbb", groups[2]);
		}
		{
			String str = "http://www.youtube.com/watch?v=ngQjsJPEqag&feature=rec-LGOUT-farside_rev-rn-2r-1-HM";
			String[] groups = RegExpUtil.getGroups(str, "http://www\\.youtube\\.com/watch\\?v=([a-zA-Z]+)");
			assertEquals("http://www.youtube.com/watch?v=ngQjsJPEqag", groups[0]);
			assertEquals("ngQjsJPEqag", groups[1]);
		}
	}
	
}
