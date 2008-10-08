package dk.in2isoft.onlineobjects.test;

import java.util.Arrays;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.lang.LangUtil;
import junit.framework.TestCase;

public class TestLangUtil extends TestCase {
	
	private static Logger log = Logger.getLogger(TestLangUtil.class);
	
	public void testRandomStringGenerator() {
		log.info("testRandomStringGenerator: 20 chars = "+LangUtil.generateRandomString(20));
		log.info("testRandomStringGenerator: 40 chars = "+LangUtil.generateRandomString(40));
	}
	
	public void testConcatWords() {
		assertEquals("", LangUtil.concatWords(new String[] {}));
		assertEquals("Jonas Munk", LangUtil.concatWords(new String[] {"","Jonas"," ","Munk","   ",null}));
	}
	
	public void testEmailValidation() {
		assertTrue(LangUtil.isWellFormedEmail("jbm@atira.dk"));
		assertTrue(LangUtil.isWellFormedEmail("xx.jb_0m@atira.dk"));
		assertTrue(LangUtil.isWellFormedEmail("xx.jb_0m@atira.dk       "));
		assertTrue(LangUtil.isWellFormedEmail("       xx.jb_0m@atira.dk       "));

		assertFalse(LangUtil.isWellFormedEmail("xx.jb_0m@atira"));
		assertFalse(LangUtil.isWellFormedEmail(null));
		assertFalse(LangUtil.isWellFormedEmail(""));
		assertFalse(LangUtil.isWellFormedEmail("xx"));
		assertFalse(LangUtil.isWellFormedEmail("xx.jb_0m@atira.00"));
		assertFalse(LangUtil.isWellFormedEmail("xx.jb_0m@atira."));
		assertTrue(StringUtils.containsOnly("abc", "abcdefghijklmnopqrstuvwxyz0123456789"));
	}
	
	public void testSplitWords() {
		assertEquals(Arrays.toString(LangUtil.getWords("a b c")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(LangUtil.getWords("a b    c")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(LangUtil.getWords("")), Arrays.toString(new String[] {}));
		assertEquals(Arrays.toString(LangUtil.getWords("a b \nc")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(LangUtil.getWords("a b \nc")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(LangUtil.getWords("a b. c")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(LangUtil.getWords("  a b \nc  ")), Arrays.toString(new String[] {"a","b","c"}));
	}
}
