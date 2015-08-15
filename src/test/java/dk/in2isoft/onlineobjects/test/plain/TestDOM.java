package dk.in2isoft.onlineobjects.test.plain;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Set;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;

import com.google.common.collect.Sets;

import dk.in2isoft.commons.xml.DOM;
import dk.in2isoft.commons.xml.Serializing;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestDOM extends AbstractSpringTestCase {

	// private static Logger log =
	// LoggerFactory.getLogger(TestHTMLDocument.class);

	@Autowired
	private HTMLService htmlService;

	@Autowired
	private SemanticService semanticService;

	@Test
	public void testParsing() throws MalformedURLException, IOException {
		String xml = "<?xml version='1.0'?><root/>";
		Document document = DOM.parse(xml);
		Assert.assertEquals(null,document.getXmlEncoding());
		document.getAttributes();
		Assert.assertNotNull(document);
		Assert.assertEquals("root", document.getDocumentElement().getNodeName());
		
		String serialized = Serializing.toString(document);
		Assert.assertEquals("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root/>", serialized);
	}

	@Test
	public void testParsingInvalid() throws MalformedURLException, IOException {
		Set<String> invalids = Sets.newHashSet(
				null,
				"",
				"<?xml version='1.0'?>",
				"<?xml version='1.0'?><root></x>");
		for (String xml : invalids) {
			Document document = DOM.parse(xml);
			Assert.assertNull(document);			
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