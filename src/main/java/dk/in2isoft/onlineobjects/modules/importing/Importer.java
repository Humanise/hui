package dk.in2isoft.onlineobjects.modules.importing;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.ProgressListener;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.ui.AsynchronousProcessDescriptor;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class Importer {
	
	private static Logger log = Logger.getLogger(Importer.class);
	
	@SuppressWarnings("unchecked")
	public void importMultipart(ApplicationController controller,Request request) throws IOException, EndUserException {
		// boolean isMultipart =
		ApplicationSession session = request.getSession().getApplicationSession(controller);
		final AsynchronousProcessDescriptor process = session.createAsynchronousProcessDescriptor("imageUpload");
		if (!ServletFileUpload.isMultipartContent(request.getRequest())) {
			process.setError(true);
			throw new SecurityException("The request is not multi-part!");
		}
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setSizeThreshold(0);
		
		ServletFileUpload upload = new ServletFileUpload(factory);
		ProgressListener progressListener = new ProgressListener() {
			public void update(long pBytesRead, long pContentLength, int pItems) {
				if (pContentLength == -1) {
					process.setValue(0);
				} else {
					process.setValue((float) pBytesRead / (float) pContentLength);
				}

			}
		};
		upload.setProgressListener(progressListener);

		// Parse the request
		try {
			List<DiskFileItem> items = upload.parseRequest(request.getRequest());
			for (DiskFileItem item : items) {
				if (!item.isFormField()) {
					try {
						processFile(item, request);
					} catch (Exception e) {
						process.setError(true);
						throw new EndUserException(e);
					}
				}
			}
		} catch (FileUploadException e) {
			process.setError(true);
			throw new EndUserException(e);
		}
		process.setCompleted(true);
	}

	private void processFile(DiskFileItem item, Request request) throws IOException, EndUserException {
		ImageService imageService = Core.getInstance().getBean(ImageService.class);
		ModelService modelService = Core.getInstance().getModel();
		File file = item.getStoreLocation();
		Image image = new Image();
		modelService.createItem(image,request.getSession());
		image.setName(item.getName());
		imageService.changeImageFile(image,file, item.getContentType());
		log.debug("width:" + image.getWidth());
		log.debug("height:" + image.getHeight());
		modelService.updateItem(image,request.getSession());
		modelService.commit();
	}
}
