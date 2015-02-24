package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.IOException;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestFileService extends AbstractSpringTestCase {
	
	@Autowired
	private FileService fileService;

	@Test
	public void testMimeType() throws EndUserException, IOException {
		testMimeType("text/plain", "loremipsum.txt");
		testMimeType("image/jpeg", "testImageWithGPS.jpg");
	}
	
	private void testMimeType(String type,String fileName) throws IOException {
		File file = getTestFile(fileName);
		String mimeType = fileService.getMimeType(file);
		assertEquals(type, mimeType);
	}
	
	@Test
	public void testCleanFileName() throws EndUserException {
		assertEquals("Image", fileService.cleanFileName("image"));
		assertEquals("Image", fileService.cleanFileName("image.jpg"));
		assertEquals("My image", fileService.cleanFileName("my_image.jpg"));
		assertEquals("My image", fileService.cleanFileName("my__image.jpg"));
		assertEquals("My image", fileService.cleanFileName("my_ _image.jpg"));
		assertEquals("Image", fileService.cleanFileName("c:\\documents\\image.jpg"));
		assertEquals("Image 789", fileService.cleanFileName("c:\\documents\\image_789.jpg"));
		assertEquals("", fileService.cleanFileName(""));
		assertEquals(null, fileService.cleanFileName(null));
	}

	@Test
	public void testGetSafeFileName() throws EndUserException {
		assertEquals("my_image.jpg", fileService.getSafeFileName("My image", "jpg"));
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}
}