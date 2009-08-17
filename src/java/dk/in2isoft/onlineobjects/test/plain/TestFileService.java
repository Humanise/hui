package dk.in2isoft.onlineobjects.test.plain;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.IOException;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestFileService extends AbstractTestCase {
	
	@Autowired
	private FileService fileService;
	

	@Test
	public void testApplicationContext() throws EndUserException, IOException {
		File file = getTestFile("testImageWithGPS.jpg");
		String mimeType = fileService.getMimeType(file);
		assertEquals("image/jpeg", mimeType);
	}
	
	@Test
	public void testCleanFileName() throws EndUserException {
		assertEquals("Image", fileService.cleanFileName("image"));
		assertEquals("Image", fileService.cleanFileName("image.jpg"));
		assertEquals("My image", fileService.cleanFileName("my_image.jpg"));
		assertEquals("Image", fileService.cleanFileName("c:\\documents\\image.jpg"));
		assertEquals("Image 789", fileService.cleanFileName("c:\\documents\\image_789.jpg"));
		assertEquals("", fileService.cleanFileName(""));
		assertEquals(null, fileService.cleanFileName(null));
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}
}