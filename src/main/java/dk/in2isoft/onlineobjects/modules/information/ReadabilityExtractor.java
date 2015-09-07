package dk.in2isoft.onlineobjects.modules.information;

import nu.xom.Document;

public class ReadabilityExtractor implements ContentExtractor {


	@Override
	public Document extract(Document document) {
		Readability readability = new Readability(document.toXML());
		return readability.getXomDocument();
	}
}
