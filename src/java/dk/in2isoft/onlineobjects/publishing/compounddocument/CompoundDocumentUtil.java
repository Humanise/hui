package dk.in2isoft.onlineobjects.publishing.compounddocument;

import nu.xom.Document;
import nu.xom.Element;
import dk.in2isoft.onlineobjects.model.CompoundDocument;

public class CompoundDocumentUtil {
	
	public static void ensureStructure(CompoundDocument compound) {
		if (compound.getStructure()==null) {
			Element root = new Element("document");
			Document doc = new Document(root);
			compound.setStructure(doc.toXML());
		}
	}
}
