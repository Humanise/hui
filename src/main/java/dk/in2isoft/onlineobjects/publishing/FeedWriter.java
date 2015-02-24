package dk.in2isoft.onlineobjects.publishing;

import java.io.IOException;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletResponse;
import javax.xml.stream.FactoryConfigurationError;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamWriter;

import org.apache.commons.lang.time.DateFormatUtils;

import dk.in2isoft.commons.lang.Strings;

public class FeedWriter {

	private XMLStreamWriter writer;

	public FeedWriter(HttpServletResponse response) throws IOException {
		try {
			writer = XMLOutputFactory.newInstance().createXMLStreamWriter(response.getOutputStream());
		} catch (XMLStreamException e) {
			throw new IOException(e);
		} catch (FactoryConfigurationError e) {
			throw new IOException(e);
		}
	}

	public void startFeed() throws XMLStreamException {		
		writer.writeStartDocument(Strings.UTF8, "1.0");
		writer.writeStartElement("rss");
		writer.writeAttribute("version", "2.0");
	}
	
	public void endFeed() throws XMLStreamException {
		writer.writeEndElement();
		writer.writeEndDocument();
	}
	
	public void startChannel(String title, String url) throws XMLStreamException {
		startElement("channel");
		writeElement("title", title);
		writeElement("link", url);
	}
	
	public void endChannel() throws XMLStreamException {
		endElement("channel");
	}
	
	public void writeItem(String title,String description, Date date) throws XMLStreamException {
		startElement("item");
		writeElement("title", title);
		writeElement("description", description);
		writeElement("pubDate", formatDate(date));
		endElement("item");
	}
	
	private void writeElement(String name, String value) throws XMLStreamException {
		startElement(name);
		write(value);
		endElement(name);
	}
	
	private void startElement(String name) throws XMLStreamException {
		writer.writeStartElement(name);
	}
	
	private void endElement(String name) throws XMLStreamException {
		writer.writeEndElement();
	}
	
	private void write(String string) throws XMLStreamException {
		if (string!=null) {
			writer.writeCharacters(string);
		}
	}
	
	private String formatDate(Date date) {
		return DateFormatUtils.format(date, "EEE, dd MMM yyyy HH:mm:ss Z", Locale.US);
	}
}
