package dk.in2isoft.onlineobjects.test.plain;

import java.io.IOException;
import java.net.MalformedURLException;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;

import dk.in2isoft.commons.xml.DOM;
import dk.in2isoft.commons.xml.DocumentCleaner;
import dk.in2isoft.commons.xml.Serializing;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestDocumentCleaner extends AbstractSpringTestCase {

	@Autowired
	private HTMLService htmlService;

	@Test
	public void testCleaning() throws MalformedURLException, IOException {
		String xml = "<?xml version='1.0'?>"
				+ "<html><body>"
				+ "<div><div><h1 class='header'>Title</h1></div></div><div/>"
				+ "<p><a href='http://www.somewhere.com/' onclick='doSomethingNasty()'><span>This is a link</span></a></p>"
				+ "</body></html>";

		String expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
				+ "<html><body>"
				+ "<h1>Title</h1>"
				+ "<p><a href=\"http://www.somewhere.com/\">This is a link</a></p>"
				+ "</body></html>";

		Document document = DOM.parseDOM(xml);

		DocumentCleaner cleaner = new DocumentCleaner();
		cleaner.clean(document);

		String serialized = Serializing.toString(document);
		Assert.assertEquals(expected, serialized);
	}

	// Wiring...

	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}