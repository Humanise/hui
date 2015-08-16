package dk.in2isoft.onlineobjects.apps.words.importing;

import java.util.List;

import com.sun.syndication.feed.rss.Item;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.modules.importing.ImportTransport;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession.Status;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.FeedService;

public class HTMLDocumentImporter implements ImportTransport, TextImporter {
	
	private FeedService feedService;
	private HTMLService htmlService;
	
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
			
			List<Item> items = feedService.getFeedItems(url);
			if (items!=null) {
				StringBuilder combined = new StringBuilder();
				for (Item item : items) {
					HTMLDocument doc = htmlService.getDocumentSilently(item.getUri());
					if (doc!=null) {
						combined.append("\n");
						combined.append(doc.getExtractedText());
						this.title = doc.getTitle();
					}
				}
				this.text = combined.toString();
			}
			status = Status.success;
			return;
		} catch (NetworkException e) {
			// Ignore, continue
		}
		
		HTMLDocument doc = htmlService.getDocumentSilently(url);

		this.text = doc.getExtractedText();
		this.title = doc.getTitle();
		status = Status.success;
	}
	
	public Object getResult() {
		return null;
	}
	
	

	public String getText() {
		return text;
	}
	
	public String getTitle() {
		return title;
	}
	
	// Wiring
	
	public void setFeedService(FeedService feedService) {
		this.feedService = feedService;
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}
