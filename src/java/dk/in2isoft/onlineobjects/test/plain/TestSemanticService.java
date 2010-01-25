package dk.in2isoft.onlineobjects.test.plain;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.MalformedURLException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.Logger;
import static org.junit.Assert.*;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestSemanticService extends AbstractTestCase {
	
	private static Logger log = Logger.getLogger(TestSemanticService.class);
	
	@Autowired
	private SemanticService semanticService;
	
	@Test
	public void testGetWords() throws EndUserException, FileNotFoundException, IOException {
		assertArrayEquals(new String[] {},semanticService.getWords(""));
		assertArrayEquals(new String[] {},semanticService.getWords("  "));

		assertArrayEquals(new String[] {"Eat","my","shorts"},semanticService.getWords("Eat my shorts"));
		assertArrayEquals(new String[] {"Eat","my","shorts"},semanticService.getWords("Eat my       shorts"));
		assertArrayEquals(new String[] {"Eat","my","shorts"},semanticService.getWords("Eat my shorts."));
		assertArrayEquals(new String[] {"Eat","my","shorts"},semanticService.getWords("Eat, \nmy _ shorts."));
		
		String text = IOUtils.toString(new FileReader(getTestFile("loremipsum.txt")));
		String[] words = semanticService.getWords(text);
		assertEquals(69, words.length);
		String[] uniqueWords = semanticService.getUniqueWords(words);
		for (String unique : uniqueWords) {
			assertTrue(ArrayUtils.contains(words, unique));
		}
	}

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}

	public SemanticService getSemanticService() {
		return semanticService;
	}
}