package dk.in2isoft.onlineobjects.model.conversion;

import nu.xom.Element;
import nu.xom.Node;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.HeaderPart;

public class HeaderPartConverter extends EntityConverter {

	@Override
	protected Node generateSubXML(Entity entity) {
		HeaderPart header = (HeaderPart) entity;
		Element root = new Element("HeaderPart",HeaderPart.NAMESPACE);
		Element text = new Element("text",HeaderPart.NAMESPACE);
		root.appendChild(text);
		text.appendChild(header.getText());
		return root;
	}

}
