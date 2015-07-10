package dk.in2isoft.onlineobjects.test.plain;

import java.io.IOException;
import java.io.StringReader;
import java.net.MalformedURLException;

import nu.xom.Builder;
import nu.xom.Document;
import nu.xom.ParsingException;
import nu.xom.ValidityException;

import org.junit.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import dk.in2isoft.commons.xml.DecoratedDocument;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestDecoratedDocument extends AbstractSpringTestCase {
	
	private Logger log = LoggerFactory.getLogger(TestDecoratedDocument.class);

	@Test
	public void testMultiLine() throws MalformedURLException, IOException, ValidityException, ParsingException {
		String xml = "<?xml version=\"1.0\"?><body><p>This is some text</p><p>spread over multiple lines</p></body>";
		Builder builder = new Builder();
		Document document = builder.build(new StringReader(xml));
		DecoratedDocument decorated = new DecoratedDocument(document);
		String text = decorated.getText();
		Assert.assertEquals("This is some text\n\nspread over multiple lines", text);
		{
			String find = "text\n\nspread";
			int start = text.indexOf(find);
			decorated.decorate(start, start + find.length(), "strong");
		}
		{
			String find = "multiple";
			int start = text.indexOf(find);
			decorated.decorate(start, start + find.length(), "u");
		}
		decorated.build();
		String result = document.toXML();
		log.info(result);
		Assert.assertEquals("<?xml version=\"1.0\"?>\n<body><p>This is some <strong>text</strong></p><p><strong>spread</strong> over <u>multiple</u> lines</p></body>\n", result);
	}

	@Test
	public void testNested() throws MalformedURLException, IOException, ValidityException, ParsingException {
		String xml = "<?xml version=\"1.0\"?><body><p>This is some text</p><p>spread over multiple lines</p></body>";
		DecoratedDocument decorated = DecoratedDocument.parse(xml);

		String text = decorated.getText();
		Assert.assertEquals("This is some text\n\nspread over multiple lines", text);
		
		{
			String find = "text\n\nspread";
			int start = text.indexOf(find);
			decorated.decorate(start, start + find.length(), "strong");
		}
		{
			String find = "ex";
			int start = text.indexOf(find);
			decorated.decorate(start, start + find.length(), "em");
		}
		{
			String find = "text";
			int start = text.indexOf(find);
			decorated.decorate(start, start + find.length(), "span");
		}
		{
			String find = "multiple";
			int start = text.indexOf(find);
			decorated.decorate(start, start + find.length(), "u");
		}
		decorated.build();
		String result = decorated.getDocument().toXML();
		log.info(result);
		Assert.assertEquals("<?xml version=\"1.0\"?>\n<body><p>This is some <span><strong>t</strong></span><em><span><strong>ex</strong></span></em><span><strong>t</strong></span></p><p><strong>spread</strong> over <u>multiple</u> lines</p></body>\n", result);
	}
}