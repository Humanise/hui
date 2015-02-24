package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import dk.in2isoft.onlineobjects.apps.words.views.util.UrlBuilder;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestUrlBuilder extends AbstractSpringTestCase {
		
	@Test
	public void testBasic() {
		UrlBuilder url = new UrlBuilder("abc").folder(3).folder((String)null);
		assertEquals("/abc/3/", url.toString());
	}
	
	@Test
	public void testBasic2() {
		UrlBuilder url = new UrlBuilder("abc").folder(3).folder((String)null).parameter("page", 2);
		assertEquals("/abc/3/?page=2", url.toString());
	}
	
	@Test
	public void testBasic3() {
		UrlBuilder url = new UrlBuilder(null).folder(3).folder((String)null).parameter("page", 2);
		assertEquals("/3/?page=2", url.toString());
	}
	
	@Test
	public void testProtocol() {
		UrlBuilder url = new UrlBuilder("http://domain.com").folder(3).folder((String)null).parameter("page", 2);
		assertEquals("http://domain.com/3/?page=2", url.toString());
	}
	
}
