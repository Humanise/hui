package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.junit.Test;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;
import dk.in2isoft.onlineobjects.util.ValidationUtil;

public class TestLangUtil extends AbstractSpringTestCase {
	
	private static Logger log = Logger.getLogger(TestLangUtil.class);
	
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
	public void testValidUsername() {
		assertFalse(ValidationUtil.isValidUsername(""));
		assertFalse(ValidationUtil.isValidUsername(null));
		assertFalse(ValidationUtil.isValidUsername(" "));
		assertFalse(ValidationUtil.isValidUsername(" abc"));
		assertFalse(ValidationUtil.isValidUsername("abc123+"));
		assertFalse(ValidationUtil.isValidUsername("jonasmunk@mac.com"));

		assertTrue(ValidationUtil.isValidUsername("a"));
		assertTrue(ValidationUtil.isValidUsername("abc"));
		assertTrue(ValidationUtil.isValidUsername("abc123"));
	}

	@Test
	public void testValidPassword() {
		assertFalse(ValidationUtil.isValidPassword(""));
		assertFalse(ValidationUtil.isValidPassword(null));
		assertFalse(ValidationUtil.isValidPassword(" "));
		assertFalse(ValidationUtil.isValidPassword("          "));
		assertFalse(ValidationUtil.isValidPassword("     abcABC123-+&     "));
		assertFalse(ValidationUtil.isValidPassword(" abcABC123-+&"));
		assertFalse(ValidationUtil.isValidPassword("abcABC123-+& "));
		assertFalse(ValidationUtil.isValidPassword("abBC12+"));

		assertTrue(ValidationUtil.isValidPassword("abcABC123-+&"));
	}

	@Test
	public void testSplitWords() {
		assertEquals(Arrays.toString(Strings.getWords("a b c")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("a b    c")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("")), Arrays.toString(new String[] {}));
		assertEquals(Arrays.toString(Strings.getWords("a b \nc")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("a b \nc")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("a b. c")), Arrays.toString(new String[] {"a","b","c"}));
		assertEquals(Arrays.toString(Strings.getWords("  a b \nc  ")), Arrays.toString(new String[] {"a","b","c"}));
	}
}
