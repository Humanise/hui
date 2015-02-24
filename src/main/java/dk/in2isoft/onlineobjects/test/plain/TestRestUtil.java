package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import dk.in2isoft.commons.util.RestUtil;

public class TestRestUtil {
	
	@Test
	public void testMatching() {
		assertTrue(RestUtil.matches("http://[a-z0-9_\\.]+:9090.*","http://62.66.229.154:9090/jbm/"));
		assertTrue(RestUtil.matches("http://[a-z0-9_\\.]+(:[0-9]{1,4})?.*","http://62.66.229.154:9090/jbm/"));
		assertTrue(RestUtil.matches("http://[a-z0-9_\\.]+(:[0-9]{1,4})?.*","http://onlineme.dk/jbm/"));
		assertTrue(RestUtil.matches("http://[a-z0-9_\\.]+(:[0-9]{1,4})?/[a-z]+/","http://onlineme.dk/jbm/"));
		assertFalse(RestUtil.matches("http://[a-z0-9_\\.]+(:[0-9]{1,4})?/[a-z]+/","http://onlineme.dk/jbm0/"));

		assertTrue(RestUtil.matches("/[a-z0-9_]+/images.html","/jbm_0/images.html"));
		assertTrue(RestUtil.matches("/<username>/images.html","/jbm_0/images.html"));
		assertFalse(RestUtil.matches("/<username>/images.html","/jbm-0/images.html"));
		assertFalse(RestUtil.matches("/<username>/images.html","/A/images.html"));

		assertTrue(RestUtil.matches("/<username>/images/<integer>.html","/jonasmunk/images/43242.html"));
		assertFalse(RestUtil.matches("/<username>/images/<integer>.html","/jonasmunk/images/43242x.html"));
		assertFalse(RestUtil.matches("/<username>/images/<integer>.html","/jonasmunk/images/43242.0.html"));

		assertTrue(RestUtil.matches("/<username>/images/<letters>-page<integer>.html","/jonasmunk/images/descending-page2.html"));
		assertFalse(RestUtil.matches("/<username>/images/<letters>-page<integer>.html","/jonasmunk/images/0descending-page2.html"));
	}
}
