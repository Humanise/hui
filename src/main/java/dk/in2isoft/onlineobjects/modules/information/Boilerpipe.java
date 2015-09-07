package dk.in2isoft.onlineobjects.modules.information;

import nu.xom.Document;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import de.l3s.boilerpipe.BoilerpipeExtractor;
import de.l3s.boilerpipe.BoilerpipeProcessingException;
import de.l3s.boilerpipe.extractors.CommonExtractors;
import de.l3s.boilerpipe.sax.BoilerpipeSAXInput;
import de.l3s.boilerpipe.sax.HTMLDocument;
import de.l3s.boilerpipe.sax.HTMLHighlighter;
import dk.in2isoft.commons.lang.Strings;

public class Boilerpipe implements ContentExtractor {

	private static final Logger log = LoggerFactory.getLogger(Boilerpipe.class);

    public String extract(String rawString) {
    	
    	if (Strings.isBlank(rawString)) {
    		return "";
    	}
    	final BoilerpipeExtractor extractor = CommonExtractors.ARTICLE_EXTRACTOR;
    	
		final HTMLDocument htmlDoc = new HTMLDocument(rawString);

		de.l3s.boilerpipe.document.TextDocument doc;
		try {
			doc = new BoilerpipeSAXInput(htmlDoc.toInputSource()).getTextDocument();
			extractor.process(doc);

			final InputSource is = htmlDoc.toInputSource();
	    	
	    	
			final HTMLHighlighter highlighted = HTMLHighlighter.newExtractingInstance();
			highlighted.setOutputHighlightOnly(true);
			highlighted.setExtraStyleSheet("");
			
			return highlighted.process(doc, is);
		} catch (IllegalArgumentException e) {
			log.warn("Unable to extract markup", e);
			// TODO May fail at de.l3s.boilerpipe.sax.HTMLHighlighter.process(HTMLHighlighter.java:126)
			// java.lang.IllegalArgumentException: Illegal group reference
		} catch (BoilerpipeProcessingException e) {
			log.warn("Unable to extract markup", e);
		} catch (SAXException e) {
			log.warn("Unable to extract markup", e);
		} catch (Exception e) {
			log.warn("Unable to extract markup", e);			
		}
		return null;
    }

	@Override
	public Document extract(Document document) {
		String extracted = extract(document.toXML());
		return new dk.in2isoft.commons.parsing.HTMLDocument(extracted).getXOMDocument();
	}
}
