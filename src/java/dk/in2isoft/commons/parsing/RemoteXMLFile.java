package dk.in2isoft.commons.parsing;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import nu.xom.Builder;
import nu.xom.ParsingException;
import nu.xom.converters.DOMConverter;

import org.apache.xerces.dom.DOMImplementationImpl;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

public class RemoteXMLFile extends RemoteFile {

    private Document DOMDocument;
    private nu.xom.Document XOMDocument;
    
	public RemoteXMLFile(URL url) {
		super(url);
	}
	
	public RemoteXMLFile(String url) throws MalformedURLException {
		super(url);
	}
	
	public Document getDOMDocument() {
		if (DOMDocument==null) {
            nu.xom.Document xom = getXOMDocument();
            DOMDocument = DOMConverter.convert(xom,DOMImplementationImpl.getDOMImplementation());
        }
	    return DOMDocument;
	}
	
	public nu.xom.Document getXOMDocument() {
        if (XOMDocument==null) {
    		    try {
                XMLReader tagsoup = XMLReaderFactory.createXMLReader("org.ccil.cowan.tagsoup.Parser");
    			   Builder bob = new Builder(tagsoup);
                XOMDocument = bob.build(this.url.toString());
        		}
        		catch (SAXException ignore) {}
        		catch (ParsingException ignore) {}
        		catch (IOException ignore) {}
        }
	    return XOMDocument;
	}
}
