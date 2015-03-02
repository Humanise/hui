package dk.in2isoft.onlineobjects.test.parsing;

import java.net.MalformedURLException;
import java.net.URL;

import org.junit.Test;

import de.l3s.boilerpipe.BoilerpipeProcessingException;
import de.l3s.boilerpipe.extractors.ArticleExtractor;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestOpenNLP extends AbstractSpringTestCase {

	@Test
	public void testIt() throws MalformedURLException, BoilerpipeProcessingException {
		URL url = new URL("http://www.dr.dk/Nyheder/Politik/2013/01/08/194542.htm");
		// NOTE: Use ArticleExtractor unless DefaultExtractor gives better results for you
		String text = ArticleExtractor.INSTANCE.getText(url);
		System.out.println(text);
	}
}
