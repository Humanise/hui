package dk.in2isoft.onlineobjects.test.plain;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.modules.youtube.YouTubeService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestYoutubeService extends AbstractSpringTestCase {
	
	//private static Logger log = Logger.getLogger(TestYoutubeService.class);
	
	@Autowired
	private YouTubeService youTubeService;
	
	@Test
	public void testExtractCode() {
		String url = "http://www.youtube.com/watch?v=ngQjsJPEqag&feature=rec-LGOUT-farside_rev-rn-2r-1-HM";
		Assert.assertEquals("ngQjsJPEqag",youTubeService.extractCodeFromUrl(url));
	}

	@Test
	public void testExtractCodeFromBogusUrls() {
		Assert.assertNull(youTubeService.extractCodeFromUrl(""));
		Assert.assertNull(youTubeService.extractCodeFromUrl(null));
		Assert.assertNull(youTubeService.extractCodeFromUrl("http://www.youtube.com/watch?h=ngQjsJPEqag&feature=rec-LGOUT-farside_rev-rn-2r-1-HM"));
	}

	public void setYouTubeService(YouTubeService youTubeService) {
		this.youTubeService = youTubeService;
	}

	public YouTubeService getYouTubeService() {
		return youTubeService;
	}

}