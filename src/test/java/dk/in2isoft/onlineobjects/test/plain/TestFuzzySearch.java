package dk.in2isoft.onlineobjects.test.plain;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

import junit.framework.TestCase;
import nu.xom.ParsingException;
import nu.xom.ValidityException;

import org.junit.Assert;
import org.junit.Test;

import dk.in2isoft.commons.lang.StringSearcher;
import dk.in2isoft.commons.lang.StringSearcher.Result;

public class TestFuzzySearch extends TestCase {

	//private Logger log = LoggerFactory.getLogger(TestFuzzySearch.class);

	@Test
	public void testGettingText() throws MalformedURLException, IOException, ValidityException, ParsingException {
		StringSearcher searcher = new StringSearcher();
		{
			String text = "This is some text\n\nspread over multiple lines";
			List<Result> search = searcher.search("text spread", text);
			Assert.assertEquals(search.size(), 1);
			Result first = search.get(0);
			Assert.assertEquals("text\n\nspread", first.getText());
		}
		{
			String text = "Han boede på en æbleø med\ten lille\nsø og et højt træ";
			List<Result> search = searcher.search("æbleø med en lille sø", text);
			Assert.assertEquals(search.size(), 1);
			Result first = search.get(0);
			Assert.assertEquals("æbleø med\ten lille\nsø", first.getText());
		}
	}
}
