package dk.in2isoft.onlineobjects.test.plain;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Set;

import junit.framework.TestCase;

import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.w3c.dom.Document;

import com.google.common.collect.Sets;

import dk.in2isoft.commons.xml.DOM;
import dk.in2isoft.commons.xml.Serializing;
import dk.in2isoft.onlineobjects.test.FastTests;

@Category(FastTests.class)
public class TestDOM extends TestCase {

	@Test
	public void testParsing() throws MalformedURLException, IOException {
		String xml = "<?xml version='1.0'?><root/>";
		Document document = DOM.parseDOM(xml);
		Assert.assertEquals(null,document.getXmlEncoding());

		Assert.assertNotNull(document);
		Assert.assertEquals("root", document.getDocumentElement().getNodeName());
		
		String serialized = Serializing.toString(document);
		Assert.assertEquals("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root/>", serialized);
	}

	@Test
	public void testXOMParsing() throws MalformedURLException, IOException {
		String xml = "<?xml version='1.0'?><root/>";
		nu.xom.Document document = DOM.parseXOM(xml);
		Assert.assertEquals("",document.getBaseURI());

		Assert.assertNotNull(document);
		Assert.assertEquals("root", document.getRootElement().getLocalName());
		
		String serialized = document.toXML();
		Assert.assertEquals("<?xml version=\"1.0\"?>\n<root />\n", serialized);
	}

	@Test
	public void testParsingInvalid() throws MalformedURLException, IOException {
		Set<String> invalids = Sets.newHashSet(
				null,
				"",
				"<?xml version='1.0'?>",
				"<?xml version='1.0'?><root></x>");
		for (String xml : invalids) {
			Document document = DOM.parseDOM(xml);
			Assert.assertNull(document);			
		}
	}

}