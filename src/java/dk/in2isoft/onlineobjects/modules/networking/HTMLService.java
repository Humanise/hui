package dk.in2isoft.onlineobjects.modules.networking;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.log4j.Logger;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.parsing.HTMLDocument;

public class HTMLService {
	private static final Logger log = Logger.getLogger(HTMLService.class);

	private NetworkService networkService;
	
	public HTMLDocument getDocumentSilently(URI uri) {
		NetworkResponse response = null;
		try {
			response = networkService.get(uri.toURL());
			if (response.isSuccess()) {
				String mimeType = response.getMimeType();
				if (mimeType==null || "text/html".equals(mimeType)) {
					String content = Files.readString(response.getFile(), response.getEncoding());
					response.cleanUp();
					return new HTMLDocument(content);
				} else {
					log.error("Incorrect mime type: "+mimeType+" for: "+uri);
				}
			} else {
				log.error("Getting HTML document unsuccessful: "+uri);
			}
		} catch (MalformedURLException e) {
			log.error(e.getMessage(),e);
		} catch (URISyntaxException e) {
			log.error(e.getMessage(),e);
		} catch (IOException e) {
			log.error(e.getMessage(),e);
		} finally {
			if (response!=null) {
				response.cleanUp();
			}
		}
		return null;
	}
	
	public HTMLDocument getDocumentSilently(File file,String encoding) {
		return new HTMLDocument(Files.readString(file, encoding));
	}

	
	public void setNetworkService(NetworkService networkService) {
		this.networkService = networkService;
	}


	public HTMLDocument getDocumentSilently(String uri) {
		if (uri!=null) {
			try {
				return getDocumentSilently(URI.create(uri));
			} catch (IllegalArgumentException e) {
				log.warn("Silent document fetch failed for: " + uri,e);
			}
		}
		return null;
	}


}
