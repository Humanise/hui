package dk.in2isoft.onlineobjects.test.plain;

import info.debatty.java.stringsimilarity.NormalizedLevenshtein;

import java.io.File;
import java.io.FileFilter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.List;

import nu.xom.Document;

import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.xml.DocumentCleaner;
import dk.in2isoft.commons.xml.DocumentToText;
import dk.in2isoft.onlineobjects.modules.information.Boilerpipe;
import dk.in2isoft.onlineobjects.modules.information.ContentExtractor;
import dk.in2isoft.onlineobjects.modules.information.ReadabilityExtractor;
import dk.in2isoft.onlineobjects.modules.information.SimpleContentExtractor;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;
import dk.in2isoft.onlineobjects.test.FastTests;
import dk.in2isoft.onlineobjects.test.SlowTests;

@Category(SlowTests.class)
public class TestExtractionComparison extends AbstractSpringTestCase {
	
	@Autowired
	private HTMLService htmlService;

	@Autowired
	private SemanticService semanticService;

	private static final Logger log = LoggerFactory.getLogger(TestExtractionComparison.class);
	
	@Test
	public void testArticleExtraction() throws Exception {
		
		List<Extractor> extractors = Lists.newArrayList();
		extractors.add(new Extractor("readability", new ReadabilityExtractor()));
		extractors.add(new Extractor("oo", new SimpleContentExtractor()));
		extractors.add(new Extractor("boilerpipe", new Boilerpipe()));
		
		File folder = new File(getResourcesDir(),"extraction");
		Assert.assertTrue(folder.isDirectory());
		File[] htmlFiles = folder.listFiles((FileFilter) pathname -> {
			return pathname.getName().endsWith("original.html");
		});
		DocumentCleaner cleaner = new DocumentCleaner();
		
		DocumentToText docToText = new DocumentToText();
		
		NormalizedLevenshtein l = new NormalizedLevenshtein();
		
		for (File file : htmlFiles) {
			String baseName = file.getName().substring(0,file.getName().length() - "original.html".length() - 1);
			String idealText = getIdealText(folder, baseName);
			HTMLDocument doc = htmlService.getDocumentSilently(file, Strings.UTF8);
			Assert.assertNotNull(doc);
			Document document = doc.getXOMDocument();
			
			try (FileWriter w = new FileWriter(new File(folder,baseName+".xhtml"))) {
				w.append(document.toXML());
			}
			
			for (Extractor extractor : extractors) {

				File out = new File(folder,baseName+"."+extractor.getName()+".html");
				try (FileWriter w = new FileWriter(out)) {
					Document extracted = extractor.getExtractor().extract(document);
					cleaner.clean(extracted);
					w.append(extracted.toXML());
					
					String text = docToText.getText(extracted);
					if (Strings.isBlank(text)) {
						log.warn("Blank: " + baseName + " - " + extractor.getName());
					}
					double comparison = l.similarity(idealText, text);//semanticService.compare(idealText, text, null);
					if (Double.isNaN(comparison)) {
						log.warn("Extracted:" + text);
					} else {
						extractor.addComparison(comparison);						
					}
					log.info(baseName + " - " + extractor.getName() + "- : " + comparison);
				}
			}
		}


		for (Extractor extractor : extractors) {
			log.info(extractor.getStatus());
		}
	}

	private String getIdealText(File folder, String baseName) throws IOException, FileNotFoundException {
		File textFile = new File(folder,baseName+".txt");
		try (FileReader reader = new FileReader(textFile)) {
			return IOUtils.toString(reader);
		}
	}
	
	private class Extractor {
		private ContentExtractor extractor;
		private String name;
		private int count;
		private double total;
		private double min = Double.MAX_VALUE;
		private double max = Double.MIN_VALUE;

		public Extractor(String name, ContentExtractor extractor) {
			super();
			this.name = name;
			this.extractor = extractor;
		}
		
		public String getStatus() {
			DecimalFormat df = new DecimalFormat("#,###,##0.00");
			return name+" | min : "+df.format(min*100)+"%, max : "+df.format(max*100)+"%, average : "+df.format(total/count*100)+"%";
		}

		public String getName() {
			return name;
		}
		
		public ContentExtractor getExtractor() {
			return extractor;
		}

		public void addComparison(double comparison) {
			min = Math.min(min, comparison);
			max = Math.max(max, comparison);
			count++;
			total+=comparison;
		}
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
	
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
}