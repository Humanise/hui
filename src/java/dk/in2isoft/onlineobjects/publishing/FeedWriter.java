package dk.in2isoft.onlineobjects.publishing;

import java.io.IOException;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.xml.serialize.OutputFormat;
import org.apache.xml.serialize.XMLSerializer;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

public class FeedWriter {

	private ContentHandler handler;

	public FeedWriter(HttpServletResponse response) throws IOException {
		
		OutputFormat of = new OutputFormat("XML", "UTF-8", true);
		XMLSerializer serializer;
		response.setContentType("application/rss+xml");
		serializer = new XMLSerializer(response.getOutputStream(), of);
		handler = serializer.asContentHandler();
	}

	public void startFeed() throws SAXException {
		handler.startDocument();
		AttributesImpl atts = new AttributesImpl();
		atts.addAttribute("","", "version", null, "2.0");
		handler.startElement("","", "rss", atts);
	}
	
	public void endFeed() throws SAXException {
		handler.endElement("", "rss", null);
		handler.endDocument();
	}
	
	public void startChannel(String title, String url) throws SAXException {
		startElement("channel");
		writeElement("title", title);
		writeElement("link", url);
	}
	
	public void endChannel() throws SAXException {
		endElement("channel");
	}
	
	public void writeItem(String title,String description, Date date) throws SAXException {
		startElement("item");
		writeElement("title", title);
		writeElement("description", description);
		writeElement("pubDate", formatDate(date));
		endElement("item");
	}
	
	private void writeElement(String name, String value) throws SAXException {
		handler.startElement("","", name, null);
		write(value);
		handler.endElement("", "", name);
	}
	
	private void startElement(String name) throws SAXException {
		handler.startElement("","", name, null);
	}
	
	private void endElement(String name) throws SAXException {
		handler.endElement("","", name);
	}
	
	private void write(String string) throws SAXException {
		if (string!=null) {
			handler.characters(string.toCharArray(), 0, string.length());
		}
	}
	
	private String formatDate(Date date) {
		return DateFormatUtils.format(date, "EEE, dd MMM yyyy HH:mm:ss Z", Locale.US);
	}
}
