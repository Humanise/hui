package dk.in2isoft.onlineobjects.test.traffic;


import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestHTMLService extends AbstractSpringTestCase {
		
	@Autowired
	private HTMLService htmlService;
	
	@Ignore
	@Test
	public void testGet() throws Exception {
		HTMLDocument document = htmlService.getDocumentSilently("http://test.onlineobjects.com/files/html/simple_utf8.html");
		String title = document.getTitle();
		Assert.assertEquals("ÆØÅ", title);
	}

	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}