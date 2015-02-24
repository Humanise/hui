package dk.in2isoft.onlineobjects.test.request;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.net.URI;
import java.net.URISyntaxException;

import org.apache.commons.lang.StringUtils;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockServletContext;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;
import dk.in2isoft.onlineobjects.ui.Request;

public class TestRequest extends AbstractSpringTestCase {

	@Test
	public void testIP() throws EndUserException {
		MockHttpServletRequest httpRequest = buildMock("http://10.20.3.5:9090/test/app/words/index/a", "/test");

		Request request = Request.get(httpRequest, null);
		request.setLocalContext(new String[] { "app", "words" });

		assertEquals("10.20.3.5", httpRequest.getLocalName());
		assertEquals("http://10.20.3.5:9090/test/app/words/index/a", httpRequest.getRequestURL().toString());
		assertEquals(9090, httpRequest.getServerPort());
		
		assertEquals("10.20.3.5", request.getDomainName());
		assertEquals("10.20.3.5/test", request.getBaseDomainContext());
		assertTrue(request.isIP());

		assertEquals("/test", request.getBaseContext());
		assertEquals("/test/app/words", request.getLocalContext());
		
		String[] fullPath = request.getFullPath();
		assertArrayEquals("Full path not as expected: "+StringUtils.join(fullPath, ","),new String[] {"app","words","index","a"}, fullPath);

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
		assertArrayEquals(new String[] {"app","words","index","a"}, request.getFullPath());
	}
	
	private MockHttpServletRequest buildMock(String completeUrl, String contextPath) {
		try {
			URI uri = new URI(completeUrl);
			MockServletContext context = new MockServletContext();
			context.setContextPath(contextPath);
			MockHttpServletRequest httpRequest = new MockHttpServletRequest(context, "get", uri.getPath());
			httpRequest.setLocalName(uri.getHost());
			httpRequest.setServerName(uri.getHost());
			httpRequest.setServletPath(completeUrl.substring(completeUrl.indexOf(contextPath)+contextPath.length()));
			httpRequest.setContextPath(contextPath);
			httpRequest.setServerPort(uri.getPort());
			return httpRequest;
		} catch (URISyntaxException e) {
			return null;
		}
	}
}
