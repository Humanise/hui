package dk.in2isoft.onlineobjects.test.traffic;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.modules.networking.NetworkResponse;
import dk.in2isoft.onlineobjects.modules.networking.NetworkService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestNetworkService extends AbstractSpringTestCase {
	
	//private static Logger log = Logger.getLogger(TestNetworkService.class);
	
	@Autowired
	private NetworkService networkService;
	
	@Test
	public void testGetString() throws Exception {
		String string = networkService.getStringSilently("http://test.humanise.dk/files/html/simple_utf8.html");
		Assert.assertTrue(Strings.isNotBlank(string));
	}
	
	@Test
	public void testGetStringFail() throws Exception {
		Assert.assertNull(networkService.getStringSilently("http://test.humanise.dk/jashfjkafhdasjfahkfdsd.html"));
		Assert.assertNull(networkService.getStringSilently(null));
		Assert.assertNull(networkService.getStringSilently(""));
		Assert.assertNull(networkService.getStringSilently(""));
		Assert.assertNull(networkService.getStringSilently("fasjfhajkfhdka"));
	}

	@Test
	public void testGetStringFailNull() throws Exception {
	}

	@Test
	public void testResponseUTF8() throws Exception {
		NetworkResponse response = networkService.get("http://test.humanise.dk/files/html/simple_utf8.html");
		Assert.assertTrue(response.isSuccess());
		Assert.assertEquals("text/html", response.getMimeType());
		Assert.assertEquals(Strings.UTF8,response.getEncoding());
		Assert.assertEquals(NetworkResponse.State.SUCCESS, response.getState());

		String string = Files.readString(response.getFile(), response.getEncoding());
		Assert.assertTrue(string.contains(Strings.UNICODE_AE_LARGE+Strings.UNICODE_OE_LARGE+Strings.UNICODE_AA_LARGE));
	}

	@Test
	public void testResponseISO() throws Exception {
		NetworkResponse response = networkService.get("http://test.humanise.dk/files/html/simple_iso-8859-1.html");
		Assert.assertTrue(response.isSuccess());
		Assert.assertEquals("text/html", response.getMimeType());
		Assert.assertEquals(Strings.ISO_8859_1,response.getEncoding());
		Assert.assertEquals(NetworkResponse.State.SUCCESS, response.getState());
				
		String string = Files.readString(response.getFile(), response.getEncoding());
		Assert.assertTrue(string.contains(Strings.UNICODE_AE_LARGE+Strings.UNICODE_OE_LARGE+Strings.UNICODE_AA_LARGE));
	}

	public void setNetworkService(NetworkService networkService) {
		this.networkService = networkService;
	}
}