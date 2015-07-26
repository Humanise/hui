package dk.in2isoft.onlineobjects.test.plain;

import java.util.List;


import junit.framework.TestCase;


import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import dk.in2isoft.commons.lang.StringSearcher;
import dk.in2isoft.commons.lang.StringSearcher.Result;

public class TestStringSearcher extends TestCase {
	
	private static final Logger log = LoggerFactory.getLogger(TestStringSearcher.class);
	
	@Test
	public void testStringSearcher() {
		String str = "Convinced? Yes*. Note, |there^ are some (rare) [cases] when*... –@()?...";
		StringSearcher searcher = new StringSearcher();
		{
			List<Result> found = searcher.search("Convinced", str);
			assertEquals(1,found.size());
		}
		{
			List<Result> found = searcher.search(str, str);
			assertEquals(1,found.size());
		}
		{
			List<Result> found = searcher.search("Convinced? Yes*.", str);
			assertEquals(1,found.size());
		}
		{
			List<Result> found = searcher.search("(rare) [cases]", str);
			assertEquals(1,found.size());
		}
		{
			List<Result> found = searcher.search("|there^", str);
			assertEquals(1,found.size());
		}
	}
	@Test
	public void testX() {
		String str = "Relational databases are very table-centric. Many operations are performed on physical, joined or derived tables in one way or another. To write SQL effectively, it is important to understand that the \n\nSELECT .. FROM\n\n clause expects a comma-separated list of table references in whatever form they may be provided.\n\n \n    \n\nDepending on the complexity of the table reference, some databases also accept sophisticated table references in other statements, such as INSERT, UPDATE, DELETE, MERGE. See \n\nOracle’s manuals for instance\n\n, explaining how to create updatable views.\n\n \n    \n\nThe Cure\n\n:\n\n \n    \n\nAlways think of your \n\nFROM";
		
		str.chars().forEach(value -> {
			if (Character.isWhitespace(value)) {
				log.debug("ws: "+value);
			}
			if (!Character.isLetter(value)) {
				log.debug("not-let: "+value + " - " + String.copyValueOf(Character.toChars(value)));
			}
		});
		StringSearcher searcher = new StringSearcher();
		{
			String search = "Depending on the complexity of the table reference, some databases also accept sophisticated table references in other statements, such as INSERT, UPDATE, DELETE, MERGE. See Oracle’s manuals for instance, explaining how to create updatable views.";
			List<Result> found = searcher.search(search, str);
			assertEquals(1,found.size());
		}
	}
	
}
