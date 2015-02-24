package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.IOException;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.lang.MimeTypes;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;
import dk.in2isoft.onlineobjects.util.images.ImageMetaData;
import dk.in2isoft.onlineobjects.util.images.ImageProperties;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class TestImageService extends AbstractSpringTestCase {
	
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

	@Test
	public void testInfo() throws EndUserException, IOException {
		File file = getTestFile("testImageWithGPS.jpg");
		ImageProperties propeties = imageService.getImageProperties(file);
		assertEquals(1600,propeties.getWidth());
		assertEquals(1200,propeties.getHeight());
		assertEquals(MimeTypes.IMAGE_JPEG,propeties.getMimeType());
	}

	@Test
	public void testCreateImageFromFile() throws EndUserException, IOException {
		File file = getTestFile("testImageWithGPS.jpg");
		File copy = File.createTempFile("testImage", "jpg");
		org.apache.commons.io.FileUtils.copyFile(file, copy);
		Assert.assertTrue(copy.exists());
		Privileged privileged = getPublicUser();
		
		Image image = imageService.createImageFromFile(copy, "test image", privileged);
		Assert.assertNotNull(image);
		assertEquals(1600,image.getWidth());
		assertEquals(1200,image.getHeight());
		assertEquals("Apple",image.getPropertyValue(Property.KEY_PHOTO_CAMERA_MAKE));
		assertEquals("iPhone",image.getPropertyValue(Property.KEY_PHOTO_CAMERA_MODEL));

		// Check the location
		Location location = modelService.getParent(image, Location.class);
		Assert.assertNotNull(location);
		assertEquals(new Double(57.225833333333334),new Double(location.getLatitude()));
		assertEquals(new Double(9.515666666666666),new Double(location.getLongitude()));
		
		// Clean up
		modelService.deleteEntity(image, privileged);
		modelService.deleteEntity(location, privileged);
		
		modelService.commit();
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

}