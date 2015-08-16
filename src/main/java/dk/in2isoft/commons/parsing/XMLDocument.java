package dk.in2isoft.commons.parsing;

import java.io.IOException;
import java.io.StringReader;

import nu.xom.Builder;
import nu.xom.ParsingException;
import nu.xom.converters.DOMConverter;

import org.apache.log4j.Logger;
import org.apache.xerces.dom.DOMImplementationImpl;
import org.ccil.cowan.tagsoup.Parser;
import org.w3c.dom.Document;

public class XMLDocument extends TextDocument {


	private static Logger log = Logger.getLogger(XMLDocument.class);
    private Document DOMDocument;
    private nu.xom.Document XOMDocument;
    	
    public XMLDocument(String raw) {
    	super(raw);
    }

    public Document getDOMDocument() {
		if (DOMDocument==null) {
            nu.xom.Document xom = getXOMDocument();
            if (xom!=null) {
            	DOMDocument = DOMConverter.convert(xom,DOMImplementationImpl.getDOMImplementation());
            	if (DOMDocument==null) {
            		log.info(xom.toXML());
            	}
            }
        }
	    return DOMDocument;
	}
	
	public nu.xom.Document getXOMDocument() {
		if (XOMDocument == null) {
			String rawString = getRawString();
			if (rawString!=null) {
				try (StringReader reader = new StringReader(rawString)){
					Parser tagsoup = new Parser();
					Builder bob = new Builder(tagsoup);
					XOMDocument = bob.build(reader);
				} catch (ParsingException e) {
					log.error(e);
				} catch (IOException e) {
					log.error(e);
				}
			}
		}
		return XOMDocument;
	}
}
