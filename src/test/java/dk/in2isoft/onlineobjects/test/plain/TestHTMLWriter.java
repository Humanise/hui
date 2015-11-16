package dk.in2isoft.onlineobjects.test.plain;

import junit.framework.TestCase;

import org.junit.Assert;
import org.junit.Test;

import dk.in2isoft.commons.lang.HTMLWriter;

public class TestHTMLWriter extends TestCase {

	@Test
	public void testDataMap() {

		HTMLWriter html = new HTMLWriter();
		
		html.startDiv().withDataMap("float",1.0,"integer",232,"string","value").endDiv();
		Assert.assertEquals("<div data=\"{&quot;float&quot;:1.0,&quot;integer&quot;:232,&quot;string&quot;:&quot;value&quot;}\"></div>",html.toString());
	}
}
