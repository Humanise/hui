package dk.in2isoft.onlineobjects.model.conversion;

import nu.xom.Element;
import nu.xom.Node;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.HtmlPart;

public class HtmlPartConverter extends EntityConverter {

	@Override
	protected Node generateSubXML(Entity entity) {
		HtmlPart header = (HtmlPart) entity;
		Element root = new Element("HtmlPart",HtmlPart.NAMESPACE);
		Element text = new Element("html",HtmlPart.NAMESPACE);
		root.appendChild(text);
		text.appendChild(header.getHtml());
		return root;
	}

}
