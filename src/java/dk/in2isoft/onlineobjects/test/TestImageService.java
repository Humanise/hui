package dk.in2isoft.onlineobjects.test;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class TestImageService extends SpringTestCase {
		
	public void testVelocity() throws EndUserException {
		ImageService imageService = getBean(ImageService.class);
		assertEquals("Image", imageService.cleanFileName("image"));
		assertEquals("Image", imageService.cleanFileName("image.jpg"));
		assertEquals("My image", imageService.cleanFileName("my_image.jpg"));
		assertEquals("Image", imageService.cleanFileName("c:\\documents\\image.jpg"));
		assertEquals("Image 789", imageService.cleanFileName("c:\\documents\\image_789.jpg"));
		assertEquals("", imageService.cleanFileName(""));
		assertEquals(null, imageService.cleanFileName(null));
	}
}