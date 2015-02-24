package dk.in2isoft.onlineobjects.test.wordnet;

import java.util.Iterator;

import org.junit.Test;

import dk.in2isoft.onlineobjects.modules.dannet.DanNetGlossary;
import dk.in2isoft.onlineobjects.modules.dannet.DanNetUtil;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestDanNetUtil extends AbstractTestCase {

	//private static final Logger log = Logger.getLogger(TestDanNetUtil.class);

	@Test
	public void testParseGlossary() {
		String str = "det 28. bogstav i den danske version af det latins ... (Brug: &quot;Det danske &#248; volder de fleste udl&#230;ndinge besv&#230;r. De kender ikke det bogstav&quot;)";
		DanNetGlossary parsed = DanNetUtil.parseGlossary(str);
		String expected = "det 28. bogstav i den danske version af det latins ...";
		String usage = "Det danske ø volder de fleste udlændinge besvær. De kender ikke det bogstav";
		assertEquals(expected, parsed.getGlossary());
		assertEquals(usage, parsed.getExamples().iterator().next());
	}

	@Test
	public void testMultipleExamples() {
		String str = "&#230;ndres i v&#230;rdi, omfang, udbredelse, status e.l. (Brug: &quot;Hvad betyder det for den enkeltes pension, at renten eller kursen g&#229;r op eller ned? || Han fors&#248;gte sig med et smil, men det gik over i en forvredet grimasse&quot;)";
		DanNetGlossary parsed = DanNetUtil.parseGlossary(str);
		String expected = "ændres i værdi, omfang, udbredelse, status e.l.";
		String usage1 = "Hvad betyder det for den enkeltes pension, at renten eller kursen går op eller ned?";
		String usage2 = "Han forsøgte sig med et smil, men det gik over i en forvredet grimasse";
		assertEquals(expected, parsed.getGlossary());
		Iterator<String> iterator = parsed.getExamples().iterator();
		assertEquals(usage1, iterator.next());
		assertEquals(usage2, iterator.next());
		
	}

	@Test
	public void testMultipleExamplesAlt() {
		String str = "ord der betegner et levende væsen, en genstand, en ... (Brug: \"Vi kan kende navneordene på, at vi kan sætte en eller et foran og bagefter, f.eks. en bold, bolden .. et vindue, vinduet\"; \"Alle substantiverne [i digtet] er skrevet med stort begyndelsesbogstav\")";
		DanNetGlossary parsed = DanNetUtil.parseGlossary(str);
		String expected = "ord der betegner et levende væsen, en genstand, en ...";
		String usage1 = "Vi kan kende navneordene på, at vi kan sætte en eller et foran og bagefter, f.eks. en bold, bolden .. et vindue, vinduet";
		String usage2 = "Alle substantiverne [i digtet] er skrevet med stort begyndelsesbogstav";
		assertEquals(expected, parsed.getGlossary());
		Iterator<String> iterator = parsed.getExamples().iterator();
		assertEquals(usage1, iterator.next());
		assertEquals(usage2, iterator.next());
		
	}
	
	
	
}