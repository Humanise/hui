package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.FileFilter;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;

import nu.xom.Document;

import org.apache.commons.lang.ArrayUtils;
import org.dom4j.DocumentException;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.xml.DocumentCleaner;
import dk.in2isoft.onlineobjects.modules.information.SimpleContentExtractor;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestHTMLDocument extends AbstractSpringTestCase {
	
	//private static Logger log = LoggerFactory.getLogger(TestHTMLDocument.class);
	
	@Autowired
	private HTMLService htmlService;

	@Autowired
	private SemanticService semanticService;
		
	@Test
	public void testComplexWikipediaPage() throws MalformedURLException, IOException {
		HTMLDocument doc = htmlService.getDocumentSilently(getTestFile("language_wikipedia.html").toURI());
		assertEquals("Language - Wikipedia, the free encyclopedia", doc.getTitle());
		String text = doc.getFullText();
		String[] words = semanticService.getWords(text);
		assertEquals(15402,words.length);
	}
	
	@Test
	public void testArticle() throws Exception {
		HTMLDocument doc = htmlService.getDocumentSilently(getTestFile("article.html").toURI());
		//log.info(doc.getText());
		assertEquals("USA hjælper Libanon med bombeundersøgelse", doc.getTitle());
		String text = doc.getText();
		String[] words = semanticService.getWords(text);
		Assert.assertFalse(ArrayUtils.contains(words, "SyrienWashington"));
		Assert.assertFalse(ArrayUtils.contains(words, "THISSHOULDBEEXCLUDED"));
		Assert.assertTrue(ArrayUtils.contains(words, "FBI-folkene"));
		Assert.assertFalse(ArrayUtils.contains(words, "-"));
	}

	@Test
	public void testArticleExtraction() throws Exception {
		File folder = new File(getResourcesDir(),"articles");
		Assert.assertTrue(folder.isDirectory());
		File[] htmlFiles = folder.listFiles((FileFilter) pathname -> {
			return pathname.getName().endsWith("html");
		});
		DocumentCleaner cleaner = new DocumentCleaner();
		
		for (File file : htmlFiles) {
			HTMLDocument doc = htmlService.getDocumentSilently(file, Strings.UTF8);
			Assert.assertNotNull(doc);
			{
				File out = new File(folder,file.getName()+".contents.htm");
				try (FileWriter w = new FileWriter(out)) {
					Document extracted = doc.getExtracted();
					cleaner.clean(extracted);
					w.append(extracted.toXML());
				}
			}
			{
				File out = new File(folder,file.getName()+".extracted.htm");
				try (FileWriter w = new FileWriter(out)) {
					Document document = doc.getXOMDocument();
					SimpleContentExtractor x = new SimpleContentExtractor();
					Document extracted = x.extract(document);
					cleaner.clean(extracted);
					w.append(extracted.toXML());
				}
			}
		}
	}

	// Wiring...

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}

	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}