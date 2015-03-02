package dk.in2isoft.onlineobjects.test.traffic;

import java.net.MalformedURLException;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.DictionaryService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestDictionaryService extends AbstractSpringTestCase {
	
	private static Logger log = Logger.getLogger(TestDictionaryService.class);
	
	@Autowired
	private SemanticService semanticService;
	
	@Autowired
	private DictionaryService dictionaryService;

	@Autowired
	private HTMLService htmlService;

	@Test
	public void testSetup() throws MalformedURLException {
		HTMLDocument htmlDocument = htmlService.getDocumentSilently("http://en.wikipedia.org/wiki/English_language");
		String text = htmlDocument.getText();
		
		String[] uniqueWords = semanticService.getUniqueWords(semanticService.getWords(text));
		log.info(uniqueWords);
		
		for (String string : uniqueWords) {
			log.info(string);
		}
		
		dictionaryService.shutDown();
	}
	
	public void setDictionaryService(DictionaryService dictionaryService) {
		this.dictionaryService = dictionaryService;
	}
	
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}
