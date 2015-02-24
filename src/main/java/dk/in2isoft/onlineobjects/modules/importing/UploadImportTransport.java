package dk.in2isoft.onlineobjects.modules.importing;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.ProgressListener;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession.Status;
import dk.in2isoft.onlineobjects.ui.Request;

public class UploadImportTransport<T> implements ImportTransport {

	private ImportListener<T> importListener;
	private T result;
	private Status status = Status.waiting;
	private float progress;
	private Request request;
	private static final Logger log = Logger.getLogger(UploadImportTransport.class);
	
	public UploadImportTransport() {
		
	}
	
	public UploadImportTransport(Request request) {
		this.request = request;
	}

	public void start() {
		
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setSizeThreshold(0);
		
		ServletFileUpload upload = new ServletFileUpload(factory);
		ProgressListener progressListener = new ProgressListener() {
			public void update(long pBytesRead, long pContentLength, int pItems) {
				if (pContentLength == -1) {
					progress = 0;
				} else {
					progress = ((float) pBytesRead / (float) pContentLength);
				}

			}
		};
		upload.setProgressListener(progressListener);

		// Parse the request
		try {
			log.info("Starting upload");
			status = Status.transferring;
			List<DiskFileItem> items = Code.castList(upload.parseRequest(request.getRequest()));
			log.info("Parsing complete");
			status = Status.processing;
			Map<String,String> parameters = Maps.newHashMap();
			for (DiskFileItem item : items) {
				if (item.isFormField()) {
					parameters.put(item.getFieldName(), item.getString());
				}
			}
			for (DiskFileItem item : items) {
				if (!item.isFormField()) {
					log.info("Handling uploaded file: "+item.getName()+" - "+item.getContentType()+" ("+item.getSize()+"byte)");
					File file = item.getStoreLocation();
					importListener.processFile(file, item.getContentType(), item.getName(), parameters, request);
					result = importListener.getResponse();
				}
			}
			log.info("Upload complete");
			status = Status.success;
		} catch (FileUploadException e) {
			status = Status.failure;
			log.error("Failed to upload file",e);
		} catch (EndUserException e) {
			log.error("Failed to upload file",e);
			status = Status.failure;
		} catch (IOException e) {
			status = Status.failure;
			log.error("Failed to upload file",e);
		}
	}
	
	public float getProgress() {
		return progress;
	}

	public Status getStatus() {
		return status;
	}

	public T getResult() {
		return result;
	}

	public void setRequest(Request request) {
		this.request = request;
	}
	
	public void setImportListener(ImportListener<T> importListener) {
		this.importListener = importListener;
	}

}
