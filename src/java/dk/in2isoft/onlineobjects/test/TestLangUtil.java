package dk.in2isoft.onlineobjects.test;

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
}
