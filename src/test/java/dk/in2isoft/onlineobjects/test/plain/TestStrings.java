package dk.in2isoft.onlineobjects.test.plain;

import java.util.Arrays;

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
	public void testEquals() {
		assertTrue(Strings.equals(null, null));
		assertTrue(Strings.equals("", ""));
		assertTrue(Strings.equals("human", "human"));

		assertFalse(Strings.equals("", null));
		assertFalse(Strings.equals("", " "));
		assertFalse(Strings.equals("human", "cow"));
	}
	
	@Test
	public void testIsInteger() {
		assertTrue(Strings.isInteger("0"));
		assertTrue(Strings.isInteger("-0"));
		assertTrue(Strings.isInteger("12"));
		assertTrue(Strings.isInteger("-12"));
		assertTrue(Strings.isInteger("4564843156"));

		assertFalse(Strings.isInteger(null));
		assertFalse(Strings.isInteger(""));
		assertFalse(Strings.isInteger("one"));
		assertFalse(Strings.isInteger("12px"));
		assertFalse(Strings.isInteger("1.2"));
		assertFalse(Strings.isInteger("1.2"));
	}
	
	@Test
	public void testDeAccent() {
		assertEquals(null, Strings.deAccent(null));
		assertEquals("", Strings.deAccent(""));
		assertEquals(" ", Strings.deAccent(" "));
		assertEquals("a", Strings.deAccent("a"));
		assertEquals("u", Strings.deAccent("ü"));
		assertEquals("a", Strings.deAccent("å"));
		assertEquals("0", Strings.deAccent("0"));
	}
	
	@Test
	public void testGetAlphabethStartLetter() {
		assertEquals("none", Strings.getAlphabethStartLetter(null));
		assertEquals("none", Strings.getAlphabethStartLetter(""));
		assertEquals("none", Strings.getAlphabethStartLetter("   "));

		assertEquals("number", Strings.getAlphabethStartLetter("1"));
		assertEquals("other", Strings.getAlphabethStartLetter("&"));
		
		assertEquals("a", Strings.getAlphabethStartLetter("   a"));
		assertEquals("a", Strings.getAlphabethStartLetter("A"));
		assertEquals("e", Strings.getAlphabethStartLetter("élisabeth"));
		assertEquals("o", Strings.getAlphabethStartLetter("örkner"));
		assertEquals("e", Strings.getAlphabethStartLetter("élisabeth"));
		assertEquals("o", Strings.getAlphabethStartLetter("õstlund"));
		assertEquals("a", Strings.getAlphabethStartLetter("änglamark-deo"));
		assertEquals("a", Strings.getAlphabethStartLetter("ángeles"));
		assertEquals("u", Strings.getAlphabethStartLetter("überkikset"));
		assertEquals("o", Strings.getAlphabethStartLetter("özenbas"));
		assertEquals("e", Strings.getAlphabethStartLetter("écriture"));
		assertEquals("a", Strings.getAlphabethStartLetter("ästa"));
		assertEquals("e", Strings.getAlphabethStartLetter("épiceries"));
		
		// Suspect...
		assertEquals("other", Strings.getAlphabethStartLetter("þoddi"));
	}

	@Test
	public void testSplitWords() {
		assertEquals(Arrays.toString(Strings.getWords("a b c")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("a b    c")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("")), Arrays.toString(new String[] {}));
		assertEquals(Arrays.toString(Strings.getWords("a b \nc")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("a b \nc")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("a b. c")), Arrays.toString(new String[] {"a","b.","c"}));
		assertEquals(Arrays.toString(Strings.getWords("Der gik en gøgler")), Arrays.toString(new String[] {"Der","gik","en","gøgler"}));
		assertEquals(Arrays.toString(Strings.getWords("  a b \nc  ")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("Han vandt 1.000-meter-loebet")), Arrays.toString(new String[] {"Han","vandt","1.000-meter-loebet"}));
	}

	@Test
	public void testHighlight() {
		{
			String text = null;
			String result = Strings.highlight(text, new String[] {"a"});
			assertEquals(null, result);
		}
		{
			String text = null;
			String result = Strings.highlight(text, null);
			assertEquals(null, result);
		}
		{
			String text = "Der var engang en mand";
			String result = Strings.highlight(text, null);
			assertEquals(text, result);
		}
		{
			String text = "Der var engang en mand";
			String result = Strings.highlight(text, new String[] {"a"});
			assertEquals("Der v<em>a</em>r eng<em>a</em>ng en m<em>a</em>nd", result);
		}
		{
			String text = "Der var engang en mand";
			String result = Strings.highlight(text, new String[] {"ng","ma","A","mand","ga","d"});
			assertEquals("<em>D</em>er v<em>a</em>r e<em>ng</em><em>a</em><em>ng</em> en <em>mand</em>", result);
		}
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
	 
	@Test
	public void testGetSimplifiedDomain() {
		assertEquals(
				"",
				Strings.getSimplifiedDomain("")
			);
		assertEquals(
				"",
				Strings.getSimplifiedDomain(null)
			);
		assertEquals(
				"",
				Strings.getSimplifiedDomain("   \n")
			);
		assertEquals(
				"whatwg.org", 
				Strings.getSimplifiedDomain("http://www.whatwg.org/specs/web-apps/current-work/#media-data")
			);
		{
			String url = "http://developer.apple.com/safari/library/documentation/QuickTime/Conceptual/QTScripting_JavaScript/aQTScripting_Javascro_AIntro/Introduction%20to%20JavaScript%20QT.html";
			assertEquals(
					"developer.apple.com", 
					Strings.getSimplifiedDomain(url)
				);
		}
	}
}
