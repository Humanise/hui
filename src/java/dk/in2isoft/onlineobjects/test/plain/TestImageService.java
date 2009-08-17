package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.IOException;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;
import dk.in2isoft.onlineobjects.util.images.ImageMetaData;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class TestImageService extends AbstractTestCase {
	
	@Autowired
	private ImageService imageService;

	@Test
	public void testMetaData() throws EndUserException, IOException {
		File file = getTestFile("testImageWithGPS.jpg");
		int[] imageDimensions = imageService.getImageDimensions(file);
		assertEquals(1600,imageDimensions[0]);
		assertEquals(1200,imageDimensions[1]);
		ImageMetaData metaData = imageService.getMetaData(file);
		assertEquals("Apple",metaData.getCameraMake());
		assertEquals("iPhone",metaData.getCameraModel());
		assertEquals(new Double(57.225833333333334),metaData.getLatitude());
		assertEquals(new Double(9.515666666666666),metaData.getLongitude());
	}


	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}


	public ImageService getImageService() {
		return imageService;
	}
}