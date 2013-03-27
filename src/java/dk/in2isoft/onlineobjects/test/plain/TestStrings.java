package dk.in2isoft.onlineobjects.test.plain;

import junit.framework.TestCase;

import org.apache.log4j.Logger;
import org.junit.Test;

import dk.in2isoft.commons.lang.Strings;

public class TestStrings extends TestCase {
	
	private static Logger log = Logger.getLogger(TestStrings.class);
	
	@Test
	public void testRandomStringGenerator() {
		log.info("testRandomStringGenerator: 20 chars = "+Strings.generateRandomString(20));
		log.info("testRandomStringGenerator: 40 chars = "+Strings.generateRandomString(40));
	}
	
	@Test
	public void testConcatWords() {
		assertEquals("", Strings.concatWords(new String[] {}));
		assertEquals("Jonas Munk", Strings.concatWords(new String[] {"","Jonas"," ","Munk","   ",null}));
	}

	@Test
	public void testSimplifyURL() {
		assertEquals(
				"", 
				Strings.simplifyURL("    ")
			);
		assertEquals(
				"", 
				Strings.simplifyURL(null)
			);
		assertEquals(
				"smashingmagazine.com : communicating-complex-ideas-with-comics", 
				Strings.simplifyURL("http://www.smashingmagazine.com/2013/03/15/communicating-complex-ideas-with-comics/")
			);
		assertEquals(
				"smashingmagazine.com : communicating-complex-ideas-with-comics", 
				Strings.simplifyURL("http://www.smashingmagazine.com/2013/03/15/communicating-complex-ideas-with-comics/   ")
			);
		assertEquals(
				"smashingmagazine.com", 
				Strings.simplifyURL("http://www.smashingmagazine.com")
			);
		{
			String url = "http://ajaxian.com/archives/amazing-audio-api-javascript-demos?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+ajaxian+%28Ajaxian+Blog%29";
			assertEquals(
					"ajaxian.com : amazing-audio-api-javascript-demos", 
					Strings.simplifyURL(url)
				);
		}
		{
			String url = "http://developer.apple.com/safari/library/documentation/QuickTime/Conceptual/QTScripting_JavaScript/aQTScripting_Javascro_AIntro/Introduction%20to%20JavaScript%20QT.html";
			assertEquals(
					"developer.apple.com : Introduction to JavaScript QT.html", 
					Strings.simplifyURL(url)
				);
		}
		{			
			String url = "http://www.whatwg.org/specs/web-apps/current-work/#media-data";
			assertEquals(
					"whatwg.org : current-work", 
					Strings.simplifyURL(url)
				);
		}
	}
}
