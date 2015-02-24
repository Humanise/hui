package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Locale;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestSemanticService extends AbstractSpringTestCase {
	
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
		assertArrayEquals(new String[] {"He","didn't","come","home"},semanticService.getWords("He didn't come home"));
		assertArrayEquals(new String[] {"He","didn’t","come","home"},semanticService.getWords("He didn’t come home"));
		assertArrayEquals(new String[] {"He","was","a","big","gun","in","the","80's"},semanticService.getWords("He was a big gun in the 80's"));
		assertArrayEquals(new String[] {"Oplyser","Midt-","og","Vestsjællands","Politi"},semanticService.getWords("Oplyser Midt- og Vestsjællands Politi"));
		
		
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
		
	@Test
	public void testSentences() throws IOException {		
		{
			String text = "Eat my shorts. He's a guy - and is called Mr. White, she's a girl and from the U.S.S.R.";
			String[] sentences = semanticService.getSentences(text, Locale.ENGLISH);
			Assert.assertTrue(sentences.length==2);
			logSentences(sentences);
		}
		{
			String[] sentences = getSentences(getTestFile("texts/obama_drone.en.txt"), new Locale("en"));
			Assert.assertTrue(Strings.contains("The red bars are U.S. strikes in Pakistan, and the gold bars are U.S. strikes in Yemen based on data collected from reliable news reports by the New America Foundation.",sentences));
			logSentences(sentences);
		}
		{
			String[] sentences = getSentences(getTestFile("texts/australien.da.txt"), new Locale("da"));
			Assert.assertTrue(Strings.contains("Flere end 2.000 personer flygtede i weekenden fra Den Tasmanske Halvø øst for Hobart, hvor turistdestinationen Port Arthur husede 700 brandflygtninge.",sentences));			
			logSentences(sentences);
		}
		{
			String[] sentences = getSentences(getTestFile("texts/chavez.da.txt"), new Locale("da"));
			Assert.assertTrue(Strings.contains("Den 58-årige Chávez blev hasteopereret 11. december i Havana i Cuba og har ifølge officielle venezuelanske kilder haft problemer med at trække vejret efterfølgende.",sentences));
			logSentences(sentences);
		}
	}
	
	private void logSentences(String[] sentences) {
		for (int i = 0; i < sentences.length; i++) {
			log.info(i+": "+sentences[i]);
		}
	}
	
	private String[] getSentences(File file, Locale locale) throws FileNotFoundException, IOException {
		String text = IOUtils.toString(new FileReader(file));
		return semanticService.getSentences(text, locale);
	}

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}

}