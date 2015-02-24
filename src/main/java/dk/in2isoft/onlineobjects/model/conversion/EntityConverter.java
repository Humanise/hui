package dk.in2isoft.onlineobjects.model.conversion;

import nu.xom.Attribute;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.Text;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;

public class EntityConverter {
	
	public final Node generateXML(Entity entity) throws ModelException {
		Element root = new Element("Entity",Entity.NAMESPACE);
		root.addAttribute(new Attribute("id",String.valueOf(entity.getId())));
		root.addAttribute(new Attribute("type",entity.getType()));
		Element name = new Element("name",Entity.NAMESPACE);
		name.appendChild(new Text(entity.getName()));
		root.appendChild(name);
		Node sub = generateSubXML(entity);
		if (sub!=null) {
			root.appendChild(sub);
		}
		return root;
	}
	
	protected Node generateSubXML(Entity entity) throws ModelException {
		return null;
	}

	protected void addSimpleNode(Element parent, String name, String value, String namespace) {
		Element element = new Element(name,namespace);
		element.appendChild(new Text(value));
		parent.appendChild(element);
	}
}
