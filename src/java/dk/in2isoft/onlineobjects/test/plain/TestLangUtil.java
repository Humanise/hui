package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.junit.Test;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;
import dk.in2isoft.onlineobjects.util.ValidationUtil;

public class TestLangUtil extends AbstractTestCase {
	
	private static Logger log = Logger.getLogger(TestLangUtil.class);
	
	@Test
	public void testRandomStringGenerator() {
		log.info("testRandomStringGenerator: 20 chars = "+LangUtil.generateRandomString(20));
		log.info("testRandomStringGenerator: 40 chars = "+LangUtil.generateRandomString(40));
	}
	
	@Test
	public void testConcatWords() {
		assertEquals("", LangUtil.concatWords(new String[] {}));
		assertEquals("Jonas Munk", LangUtil.concatWords(new String[] {"","Jonas"," ","Munk","   ",null}));
	}
	
	@Test
	public void testEmailValidation() {
		assertTrue(ValidationUtil.isWellFormedEmail("jbm@atira.dk"));
		assertTrue(ValidationUtil.isWellFormedEmail("xx.jb_0m@atira.dk"));
		assertTrue(ValidationUtil.isWellFormedEmail("xx.jb_0m@atira.dk       "));
		assertTrue(ValidationUtil.isWellFormedEmail("       xx.jb_0m@atira.dk       "));

		assertFalse(ValidationUtil.isWellFormedEmail("xx.jb_0m@atira"));
		assertFalse(ValidationUtil.isWellFormedEmail(null));
		assertFalse(ValidationUtil.isWellFormedEmail(""));
		assertFalse(ValidationUtil.isWellFormedEmail("xx"));
		assertFalse(ValidationUtil.isWellFormedEmail("xx.jb_0m@atira.00"));
		assertFalse(ValidationUtil.isWellFormedEmail("xx.jb_0m@atira."));
		assertTrue(StringUtils.containsOnly("abc", "abcdefghijklmnopqrstuvwxyz0123456789"));
	}
	
	@Test
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
