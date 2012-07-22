package dk.in2isoft.onlineobjects.test.request;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.net.URI;
import java.net.URISyntaxException;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockServletContext;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;
import dk.in2isoft.onlineobjects.ui.Request;

public class TestRequest extends AbstractTestCase {

	@Test
	public void testIP() throws EndUserException {
		MockHttpServletRequest httpRequest = buildMock("http://10.20.3.5:9090/test/app/words/index/a", "/test");

		Request request = Request.get(httpRequest, null);
		request.setLocalContext(new String[] { "app", "words" });

		assertEquals("10.20.3.5", httpRequest.getLocalName());
		assertEquals("http://10.20.3.5:9090/test/app/words/index/a", httpRequest.getRequestURI());
		assertEquals(9090, httpRequest.getServerPort());
		
		assertEquals("10.20.3.5", request.getDomainName());
		assertEquals("10.20.3.5/test", request.getBaseDomainContext());
		assertTrue(request.isIP());

		assertEquals("/test", request.getBaseContext());
		assertEquals("/test/app/words", request.getLocalContext());
		
		assertArrayEquals(new String[] {"app","words","index","a"}, request.getFullPath());

		assertEquals("/index/a", request.getLocalPathAsString());
		assertArrayEquals(new String[] {"index","a"}, request.getLocalPath());

		
		assertEquals("/test", request.getBaseContext());

	}

	@Test
	public void testDomainName() throws EndUserException {
		MockHttpServletRequest httpRequest = buildMock("http://words.onlineobjects.com/test/app/words/index/a", "/test");

		Request request = Request.get(httpRequest, null);
		assertEquals("words.onlineobjects.com", request.getDomainName());
		assertEquals("onlineobjects.com", request.getBaseDomain());
		assertEquals("onlineobjects.com/test", request.getBaseDomainContext());
	}
	
	private MockHttpServletRequest buildMock(String uri, String contextPath) {
		try {
			URI uri2 = new URI(uri);
			MockServletContext context = new MockServletContext();
			context.setContextPath(contextPath);
			MockHttpServletRequest httpRequest = new MockHttpServletRequest(context, "get", uri);
			httpRequest.setLocalName(uri2.getHost());
			httpRequest.setServerName(uri2.getHost());
			httpRequest.setServletPath(uri.substring(uri.indexOf(contextPath)+contextPath.length()));
			httpRequest.setContextPath(contextPath);
			httpRequest.setServerPort(uri2.getPort());
			return httpRequest;
		} catch (URISyntaxException e) {
			return null;
		}
	}
}
