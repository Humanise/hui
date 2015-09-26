package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Locale;

import opennlp.tools.util.Span;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestSemanticService extends AbstractSpringTestCase {
	
	private static Logger log = Logger.getLogger(TestSemanticService.class);
	
	@Autowired
	private SemanticService semanticService;

	@Autowired
	private LanguageService languageService;
	
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
		assertArrayEquals(new String[] {"He","didn\u2019t","come","home"},semanticService.getWords("He didn\u2019t come home"));
		assertArrayEquals(new String[] {"He","was","a","big","gun","in","the","80's"},semanticService.getWords("He was a big gun in the 80's"));
		assertArrayEquals(new String[] {"Oplyser","Midt-","og","Vestsjællands","Politi"},semanticService.getWords("Oplyser Midt- og Vestsjællands Politi"));
		
		
		assertArrayEquals(new String[] {"Æblet","på","øen","Åen","ændrer","søen","Østers","får","ællinger"},semanticService.getWords("Æblet på øen. Åen ændrer søen. Østers får ællinger."));

		String text = getTestFileAsString("loremipsum.txt");
		String[] words = semanticService.getWords(text);
		assertEquals(69, words.length);
		String[] uniqueWords = semanticService.getUniqueWords(words);
		for (String unique : uniqueWords) {
			assertTrue(ArrayUtils.contains(words, unique));
		}
	}

	@Test
	public void testIsWord() throws Exception {
		assertFalse(semanticService.isWordToken(null));
		assertFalse(semanticService.isWordToken(""));
		assertFalse(semanticService.isWordToken("."));
		assertFalse(semanticService.isWordToken(","));
		assertFalse(semanticService.isWordToken(":"));

		assertTrue(semanticService.isWordToken("abe"));
		assertTrue(semanticService.isWordToken("Abe"));
		assertTrue(semanticService.isWordToken("Abe."));
	}

	@Test
	public void testStripQuotes() throws Exception {
		assertEquals(null,semanticService.stripQuotes(null));
		assertEquals("",semanticService.stripQuotes(""));
		assertEquals("Abe",semanticService.stripQuotes("Abe"));
		assertEquals("Abe",semanticService.stripQuotes("'Abe'"));
		assertEquals("Abe",semanticService.stripQuotes("«Abe»'"));
		assertEquals("Abe",semanticService.stripQuotes("’Abe’"));
		assertEquals("Abe",semanticService.stripQuotes("(Abe)"));
		assertEquals("Abe",semanticService.stripQuotes("--Abe))"));
		assertEquals("Abe",semanticService.stripQuotes("Abe.."));
		assertEquals("maximalism",semanticService.stripQuotes("“maximalism”"));
		
		assertEquals("U.S.A.",semanticService.stripQuotes("U.S.A."));
	}
	@Test
	public void testGetNaturalWords() throws Exception {
		{
			String text = getTestFileAsString("texts/australien.da.txt");
			Locale locale = languageService.getLocale(text);
			assertEquals("da",locale.getLanguage());
			String[] wordTokens = semanticService.getNaturalWords(text, locale);
			log.info(Strings.concatWords(wordTokens));
		}
		{
			String text = getTestFileAsString("texts/chavez.da.txt");
			Locale locale = languageService.getLocale(text);
			assertEquals("da",locale.getLanguage());
			String[] wordTokens = semanticService.getNaturalWords(text, locale);
			log.info(Strings.concatWords(wordTokens));
		}
		{
			String text = getTestFileAsString("texts/chavez.da.txt");
			Locale locale = languageService.getLocale(text);
			assertEquals("da",locale.getLanguage());
			String[] wordTokens = semanticService.getTokensAsString(text, locale);
			log.info(Strings.concatWords(wordTokens));
		}
		{
			String html = getTestFileAsString("articles/the-characteristics-of-minimalism-in-web-design-nngroup-com.html");
			HTMLDocument doc = new HTMLDocument(html);
			String text = doc.getExtractedText();
			Locale locale = languageService.getLocale(text);
			assertEquals("en",locale.getLanguage());
			String[] naturalWords = semanticService.getNaturalWords(text, locale);
			log.info(Strings.concatWords(naturalWords));
		}
	}

	@Test
	public void testIsNaturalWord() throws EndUserException, FileNotFoundException, IOException {
		assertFalse(semanticService.isRegularWord(null));
		assertFalse(semanticService.isRegularWord(""));
		assertFalse(semanticService.isRegularWord(" "));
		assertFalse(semanticService.isRegularWord("1"));
		assertFalse(semanticService.isRegularWord("1.5"));
		assertFalse(semanticService.isRegularWord("1:5"));
		assertFalse(semanticService.isRegularWord("15/4/1980"));
		assertFalse(semanticService.isRegularWord("1,4"));
		assertFalse(semanticService.isRegularWord("192.168.1.14"));
		assertFalse(semanticService.isRegularWord("45,-"));
		assertFalse(semanticService.isRegularWord("54:26:96:da:e2:95"));
		assertFalse(semanticService.isRegularWord("jonasmunk@mac.com"));
		assertFalse(semanticService.isRegularWord("0-521-20693-6"));

		assertFalse(semanticService.isRegularWord("15m"));
		assertFalse(semanticService.isRegularWord("15hz"));
		assertFalse(semanticService.isRegularWord("15mm"));
		assertFalse(semanticService.isRegularWord("15lbs"));
		assertFalse(semanticService.isRegularWord("15th"));
		assertFalse(semanticService.isRegularWord("21st"));
		assertFalse(semanticService.isRegularWord("/ritzau/"));

		assertTrue(semanticService.isRegularWord("Ape"));
		assertTrue(semanticService.isRegularWord("I"));
		assertTrue(semanticService.isRegularWord("100-dollar-bill"));
		assertTrue(semanticService.isRegularWord("0-412-42830-x"));
	}

	@Test
	public void testIsAbbreviation() throws EndUserException, FileNotFoundException, IOException {
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
			String text = "Just as flat design is a reaction to skeuomorphism, minimalism is a reaction to maximalism. In both cases, we strongly advise a balanced approach. A minimalist design strategy can be a powerful tool, but only when it’s framed by the needs of your users—minimalism for minimalism’s sake alone doesn’t help users.";
			Locale locale = Locale.ENGLISH;
			String[] sentences = semanticService.getSentences(text, locale);
			String[] expected = {"Just as flat design is a reaction to skeuomorphism, minimalism is a reaction to maximalism.",
					"In both cases, we strongly advise a balanced approach.",
					"A minimalist design strategy can be a powerful tool, but only when it’s framed by the needs of your users—minimalism for minimalism’s sake alone doesn’t help users."
					};
			Assert.assertArrayEquals(expected, sentences);
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
	
	@Test
	public void testTokens() {
		String text = "Men hun er ikke afvisende over for, at menneskesmuglere har fokus på velfærdsydelserne i EU. Hun opfordrer derfor Støjberg til at granske fordelingen af flygtninge i Europa og sammenligne den med graden af sociale ydelser og chancerne for familiesammenføring.";
		Locale locale = new Locale("da");
		String[] words = semanticService.getTokensAsString(text, locale);
		StringBuilder annotated = new StringBuilder();
		for (int i = 0; i < words.length; i++) {
			annotated.append(words[i]);
			annotated.append("|");
		}
		String[] unique = semanticService.getUniqueWordsWithoutPunctuation(words);
		Assert.assertEquals("at", unique[7]);
		log.info(annotated.toString());		
	}
	
	@Test
	public void testPartOfSpeach() {
		String text = "Den 58-årige Chávez blev hasteopereret 11. december i Havana i Cuba og har ifølge officielle venezuelanske kilder haft problemer med at trække vejret efterfølgende.";
		Locale locale = new Locale("da");
		Span[] spans = semanticService.getTokenSpans(text, locale);
		String[] words = semanticService.spansToStrings(spans, text);
		String[] partOfSpeach = semanticService.getPartOfSpeach(words, locale);
		assertEquals(words.length, partOfSpeach.length);
		StringBuilder annotated = new StringBuilder();
		for (int i = 0; i < words.length; i++) {
			annotated.append(words[i] + " ["+partOfSpeach[i]+"] ");
		}
		log.info(annotated.toString());
		
		// TODO: This page explains the tags: http://paula.petcu.tm.ro/init/default/post/opennlp-part-of-speech-tags
	}

	@Test
	public void testPartOfSpeachEnglish() {
		String text = "Peter and Mary bought a new car today from a car shop in San Francisco.";
		Locale locale = Locale.ENGLISH;
		Span[] spans = semanticService.getTokenSpans(text, locale);
		String[] words = semanticService.spansToStrings(spans, text);
		String[] partOfSpeach = semanticService.getPartOfSpeach(words, locale);
		assertEquals(words.length, partOfSpeach.length);
		StringBuilder annotated = new StringBuilder();
		for (int i = 0; i < words.length; i++) {
			annotated.append(words[i] + " ["+partOfSpeach[i]+"] ");
		}
		log.info(annotated.toString());
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