package dk.in2isoft.onlineobjects.apps.words.importing;

import java.net.MalformedURLException;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.modules.importing.ImportHandler;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession.Status;

public class HTMLDocumentImporter implements ImportHandler, TextImporter {
	
	private Status status = Status.waiting;
	private final String url;
	private String text;
	private String title;

	public HTMLDocumentImporter(String url) {
		super();
		this.url = url;
	}

	public Status getStatus() {
		return status;
	}

	public void start() {
		try {
			status = Status.transferring;
			HTMLDocument doc = new HTMLDocument(url);
			this.text = doc.getText();
			this.title = doc.getTitle();
			status = Status.success;
		} catch (MalformedURLException e) {
			this.status = Status.failure;
		}
	}

	public String getText() {
		return text;
	}
	
	public String getTitle() {
		return title;
	}
}
