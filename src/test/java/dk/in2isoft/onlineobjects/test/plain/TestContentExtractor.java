package dk.in2isoft.onlineobjects.test.plain;

import java.io.IOException;
import java.net.MalformedURLException;

import nu.xom.Document;

import org.junit.Assert;
import org.junit.Test;
import org.openjena.atlas.logging.Log;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.xml.DOM;
import dk.in2isoft.onlineobjects.modules.information.SimpleContentExtractor;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestContentExtractor extends AbstractSpringTestCase {
	
	@Autowired
	private HTMLService htmlService;

	@Test
	public void testSimple() throws MalformedURLException, IOException {
		String xml = "<?xml version='1.0'?>"
				+ "<html xmlns='http://www.w3.org/1999/xhtml'><body>"
				+ "<div role='banner'>I am a banner</div>"
				+ "<div>"
				+ "<h1>This is the title</h1>"
				+ "<p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nulla vitae elit libero, a pharetra augue.</p>"
				+ "<p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas faucibus mollis interdum.</p>"
				+ "</div>"
				+ "<ul><li><a href='#'>Please buy this!</a></li></ul>"
				+ "<p>This is just some junk</p>"
				+ "</body></html>";

		Document document = DOM.parseXOM(xml);

		SimpleContentExtractor extractor = new SimpleContentExtractor();
		
		Document extracted = extractor.extract(document);
		
		String serialized = extracted.toXML();
		String expected = "<?xml version=\"1.0\"?>\n" +
				"<html xmlns=\"http://www.w3.org/1999/xhtml\"><body><div>" + 
				"<h1>This is the title</h1>" + 
				"<p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nulla vitae elit libero, a pharetra augue.</p>" + 
				"<p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas faucibus mollis interdum.</p>" + 
				"</div></body></html>\n";
		Assert.assertEquals(expected , serialized);
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}