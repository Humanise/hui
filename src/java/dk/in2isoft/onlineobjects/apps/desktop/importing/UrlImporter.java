package dk.in2isoft.onlineobjects.apps.desktop.importing;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.http.HeaderUtil;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.modules.importing.ImportHandler;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession.Status;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class UrlImporter implements ImportHandler {

	private static final Logger log = Logger.getLogger(UrlImporter.class);
	
	private ConfigurationService configurationService;
	private String uri;
	private Status status = Status.waiting;
	private ImageService imageService;
	private ImportListener listener;
	
	private Entity result;
	
	public UrlImporter(String uri, ImportListener listener) {
		this.uri = uri;
		this.listener = listener;
	}
	
	public Entity getResult() {
		return result;
	}
	
	public void start() {
		HttpClient client = new HttpClient();
		HttpMethod method = new GetMethod(uri);
		InputStream inputStream = null;
		OutputStream outputStream = null;
		try {
			log.info("Url import started: "+uri);
			File tempFile = File.createTempFile("raw", null);
			tempFile.deleteOnExit();
			status = Status.transferring;
			client.executeMethod(method);
			String mimeType = null;
			Header header = method.getResponseHeader("Content-Type");
			if (header!=null) {
				log.info("Content-Type: "+header.getValue());
				mimeType = HeaderUtil.getContentTypesMimeType(header.getValue());
				log.info("Mime: "+mimeType);
			} else {
				log.warn("No header received from: "+uri);
			}
			inputStream = method.getResponseBodyAsStream();
			outputStream = new FileOutputStream(tempFile);
			IOUtils.copy(inputStream, outputStream);
			log.info("Url import finished");
			status = Status.processing;
			result = listener.urlWasImported(tempFile, uri, mimeType);
			status = Status.success;
			log.info("Processing the file finished");
		} catch (HttpException e) {
			this.status = Status.failure;
			log.error("Unable to get: "+uri,e);
		} catch (IOException e) {
			this.status = Status.failure;
			log.error("Unable to get: "+uri,e);
		} catch (ModelException e) {
			this.status = Status.failure;
			log.error("Error processing: "+uri,e);
		} finally {
			log.info("Url import closing: "+status);
			IOUtils.closeQuietly(inputStream);
			IOUtils.closeQuietly(outputStream);
		}
	}

	public Status getStatus() {
		return status;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

}
