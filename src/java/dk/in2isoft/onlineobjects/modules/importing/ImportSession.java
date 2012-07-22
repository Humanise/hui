package dk.in2isoft.onlineobjects.modules.importing;

import java.net.MalformedURLException;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.NetworkException;
import dk.in2isoft.onlineobjects.core.SubSession;

public class ImportSession extends SubSession {

	public static enum Status {waiting,fetching,processing,finished}
		
	private Status status = Status.waiting;
	private HTMLDocument document;

	public void setStatus(Status status) {
		this.status = status;
	}

	public Status getStatus() {
		return status;
	}
	
	public void importFromUrl(String url) throws NetworkException {
		try {
			status = Status.fetching;
			this.document = new HTMLDocument(url);
			this.document.getText();
			status = Status.processing;
		} catch (MalformedURLException e) {
			throw new NetworkException("The url is not supported: "+url, e);
		}
	}
	
	public HTMLDocument getDocument() {
		return document;
	}
}
