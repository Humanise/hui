package dk.in2isoft.onlineobjects.test.plain;

import java.io.File;
import java.io.FileFilter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import nu.xom.Document;

import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.xml.DocumentCleaner;
import dk.in2isoft.commons.xml.DocumentToText;
import dk.in2isoft.onlineobjects.modules.information.Boilerpipe;
import dk.in2isoft.onlineobjects.modules.information.ContentExtractor;
import dk.in2isoft.onlineobjects.modules.information.Readability;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestExtractionComparison extends AbstractSpringTestCase {
	
	@Autowired
	private HTMLService htmlService;

	@Autowired
	private SemanticService semanticService;

	private static final Logger log = LoggerFactory.getLogger(TestExtractionComparison.class);
	
	@Test
	public void testArticleExtraction() throws Exception {
		File folder = new File(getResourcesDir(),"extraction");
		Assert.assertTrue(folder.isDirectory());
		File[] htmlFiles = folder.listFiles((FileFilter) pathname -> {
			return pathname.getName().endsWith("original.html");
		});
		DocumentCleaner cleaner = new DocumentCleaner();
		
		DocumentToText docToText = new DocumentToText();
		
		for (File file : htmlFiles) {
			String baseName = file.getName().substring(0,file.getName().length() - "original.html".length() - 1);
			String idealText = getIdealText(folder, baseName);
			HTMLDocument doc = htmlService.getDocumentSilently(file, Strings.UTF8);
			Assert.assertNotNull(doc);
			String html = doc.getRawString();
			{
				File out = new File(folder,baseName+".readability.html");
				try (FileWriter w = new FileWriter(out)) {
					Readability readability = new Readability(html);
			    	Document xom = readability.getXomDocument();
					cleaner.clean(xom);
					w.append(xom.toXML());
					
					double comparison = semanticService.compare(idealText, docToText.getText(xom), null);
					log.info(baseName + " - Readability: " + comparison);
				}
			}
			{
				File out = new File(folder,baseName+".boilerpipe.html");
				try (FileWriter w = new FileWriter(out)) {
					Boilerpipe boiler = new Boilerpipe();
					String extracted = boiler.extract(html);
					Document xom = new HTMLDocument(extracted).getXOMDocument();
					cleaner.clean(xom);
					w.append(xom.toXML());
					double comparison = semanticService.compare(idealText, docToText.getText(xom), null);
					log.info(baseName + " - Boilerpipe: " + comparison);
				}
			}
			{
				File out = new File(folder,baseName+".extracted.html");
				try (FileWriter w = new FileWriter(out)) {
					Document document = doc.getXOMDocument();
					ContentExtractor x = new ContentExtractor();
					Document xom = x.extract(document);
					cleaner.clean(xom);
					w.append(xom.toXML());

					double comparison = semanticService.compare(idealText, docToText.getText(xom), null);
					log.info(baseName + " - OnlineObjects: " + comparison);
				}
			}
		}
	}

	private String getIdealText(File folder, String baseName) throws IOException, FileNotFoundException {
		File textFile = new File(folder,baseName+".txt");
		try (FileReader reader = new FileReader(textFile)) {
			return IOUtils.toString(reader);
		}
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
	
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
}