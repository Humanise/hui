package dk.in2isoft.commons.parsing;

import java.io.IOException;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;

import nu.xom.Builder;
import nu.xom.ParsingException;
import nu.xom.converters.DOMConverter;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.apache.xerces.dom.DOMImplementationImpl;
import org.ccil.cowan.tagsoup.Parser;
import org.w3c.dom.Document;

public class XMLDocument extends TextDocument {

	private static Logger log = Logger.getLogger(XMLDocument.class);
    private Document DOMDocument;
    private nu.xom.Document XOMDocument;
    
	public XMLDocument(URL url) {
		super(url);
	}
	
	public XMLDocument(String url) throws MalformedURLException {
		super(url);
	}
	
	public Document getDOMDocument() {
		if (DOMDocument==null) {
            nu.xom.Document xom = getXOMDocument();
            if (xom!=null) {
            	DOMDocument = DOMConverter.convert(xom,DOMImplementationImpl.getDOMImplementation());
            }
        }
	    return DOMDocument;
	}
	
	public nu.xom.Document getXOMDocument() {
		if (XOMDocument == null) {
			StringReader reader = null;
			try {
				Parser tagsoup = new Parser();
				Builder bob = new Builder(tagsoup);
				String rawString = getRawString();
				if (rawString!=null) {
					reader = new StringReader(rawString);
					XOMDocument = bob.build(reader);
				}
			} catch (ParsingException e) {
				log.error(e);
			} catch (IOException e) {
				log.error(e);
			} finally {
				IOUtils.closeQuietly(reader);
			}
		}
		return XOMDocument;
	}
}
