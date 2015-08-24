package dk.in2isoft.onlineobjects.test.plain;

import org.junit.Assert;
import org.junit.Test;

import dk.in2isoft.commons.xml.DOM;
import dk.in2isoft.commons.xml.DocumentToText;
import junit.framework.TestCase;

public class TestDocumentToText extends TestCase {

	@Test
	public void testIt() {
		String xml = "<?xml version='1.0'?><html>" +
				"<head><title>Hello world</title></head>" +
				"<!-- Hep hey -->" +
				"<body>" + 
				"<style>h1 {color: red;}</style>" +
				"<div><h1>Lorem  <span>ipsum</span></h1></div>" + 
				"<p>Abe</p>" + 
				"<div>Hest<br/>Hund</div>" +
				"Flodhest"+
				"<script>doSomething();</script>" +
				"</body>" + 
				"</html>";
		nu.xom.Document document = DOM.parseXOM(xml);
		String text = new DocumentToText().getText(document);
		
		Assert.assertEquals("Lorem ipsum\n\nAbe\n\nHest\nHund\nFlodhest", text);
	}
}
