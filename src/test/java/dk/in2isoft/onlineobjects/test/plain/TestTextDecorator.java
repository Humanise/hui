package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import dk.in2isoft.commons.lang.TextDecorator;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestTextDecorator extends AbstractSpringTestCase {	
	
	@Test
	public void testSimpleDecoration() {
		TextDecorator decorator = new TextDecorator();
		decorator.addHighlight("Purus Malesuada");
		String text = "Pellentesque Purus Malesuada Nibh Pharetra";
		String result = decorator.process(text);
		assertEquals("Pellentesque <em>Purus Malesuada</em> Nibh Pharetra", result);
	}

	@Test
	public void testSimpleDecoration2() {
		TextDecorator decorator = new TextDecorator();
		decorator.addHighlight("Purus Malesuada");
		String text = "Pellentesque Purus  Malesuada Nibh Pharetra";
		String result = decorator.process(text);
		assertEquals("Pellentesque <em>Purus Malesuada</em> Nibh Pharetra", result);
	}
}
