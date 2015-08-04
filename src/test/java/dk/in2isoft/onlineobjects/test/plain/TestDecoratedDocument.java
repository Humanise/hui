package dk.in2isoft.onlineobjects.test.plain;

import java.io.IOException;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

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
	public void testMultiLine() throws MalformedURLException, IOException,
			ValidityException, ParsingException {
		String xml = "<?xml version=\"1.0\"?><body><p>This is some text</p><p>spread over multiple lines</p></body>";
		Builder builder = new Builder();
		Document document = builder.build(new StringReader(xml));
		DecoratedDocument decorated = new DecoratedDocument(document);
		String text = decorated.getText();
		Assert.assertEquals("This is some text\n\nspread over multiple lines",text);
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
		Assert.assertEquals(
				"<?xml version=\"1.0\"?>\n<body><p>This is some <strong>text</strong></p><p><strong>spread</strong> over <u>multiple</u> lines</p></body>\n",
				result);
	}

	@Test
	public void testX() throws MalformedURLException, IOException,
			ValidityException, ParsingException {
		String xml = "<?xml version=\"1.0\"?><p>Depending on the complexity of the table reference, some databases also accept sophisticated table references in other statements, such as INSERT, UPDATE, DELETE, MERGE. See <a shape=\"rect\" href=\"http://docs.oracle.com/cd/B28359_01/server.111/b28286/statements_8004.htm#i2126726\">Oracle’s manuals for instance</a>, explaining how to create updatable views.</p>";
		Builder builder = new Builder();
		Document document = builder.build(new StringReader(xml));
		DecoratedDocument decorated = new DecoratedDocument(document);
		String text = decorated.getText();
		Assert.assertEquals(
				"Depending on the complexity of the table reference, some databases also accept sophisticated table references in other statements, such as INSERT, UPDATE, DELETE, MERGE. See Oracle’s manuals for instance, explaining how to create updatable views.",
				text);
	}

	@Test
	public void testNested() throws MalformedURLException, IOException,
			ValidityException, ParsingException {
		String xml = "<?xml version=\"1.0\"?><body><p>This is some text</p><p>spread over multiple lines</p></body>";
		DecoratedDocument decorated = DecoratedDocument.parse(xml);

		String text = decorated.getText();
		Assert.assertEquals("This is some text\n\nspread over multiple lines",
				text);

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
		Assert.assertEquals(
				"<?xml version=\"1.0\"?>\n<body><p>This is some <span><strong>t</strong></span><em><span><strong>ex</strong></span></em><span><strong>t</strong></span></p><p><strong>spread</strong> over <u>multiple</u> lines</p></body>\n",
				result);
	}

	@Test
	public void testGetText() throws MalformedURLException, IOException,
			ValidityException, ParsingException {
		Map<String, String> tests = new HashMap<>();
		tests.put("", "");
		tests.put("<p></p><p></p>", "");
		tests.put("<p></p><p> </p>", " ");
		tests.put("<p></p><p><span> </span></p>", " ");
		tests.put("<p>A</p><span>B</span>", "A\n\nB");
		tests.put("<p>This is some text</p><p>spread over multiple lines</p>",
				"This is some text\n\nspread over multiple lines");
		tests.put(
				"<p>This is some <span>text</span></p><p>spread over <em>multiple</em> lines</p>",
				"This is some text\n\nspread over multiple lines");
		tests.put(
				"<p>This is some text</p><p><span>spread over multiple lines</span></p>",
				"This is some text\n\nspread over multiple lines");
		tests.put(
				"<p>This is some text</p><p><span><span>spread over <strong>multiple</strong> lines</span></span></p>",
				"This is some text\n\nspread over multiple lines");

		for (Entry<String, String> entry : tests.entrySet()) {
			String xml = "<?xml version=\"1.0\"?><body>" + entry.getKey()
					+ "</body>";
			DecoratedDocument decorated = DecoratedDocument.parse(xml);
			Assert.assertEquals(entry.getValue(), decorated.getText());
		}
	}
}