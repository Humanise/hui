package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.Logger;
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
		assertArrayEquals(new String[] {"Eat","my","shorts"},semanticService.getWords("Eat, \nmy _ shorts."));
		
		assertArrayEquals(new String[] {"Æblet","på","øen","Åen","ændrer","søen","Østers","får","ællinger"},semanticService.getWords("Æblet på øen. Åen ændrer søen. Østers får ællinger."));

		String text = IOUtils.toString(new FileReader(getTestFile("loremipsum.txt")));
		String[] words = semanticService.getWords(text);
		assertEquals(69, words.length);
		String[] uniqueWords = semanticService.getUniqueWords(words);
		for (String unique : uniqueWords) {
			assertTrue(ArrayUtils.contains(words, unique));
		}
	}

	@Test
	public void testAbbreviations() throws EndUserException, FileNotFoundException, IOException {
		assertTrue(semanticService.isAbbreviation("BC"));
		assertTrue(semanticService.isAbbreviation("NATO"));
		assertTrue(semanticService.isAbbreviation("FN"));
	}
		
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}

	public SemanticService getSemanticService() {
		return semanticService;
	}
}