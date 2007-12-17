package dk.in2isoft.onlineobjects.model.conversion;

import nu.xom.Element;
import nu.xom.Node;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;

public class EmailAddressConverter extends EntityConverter {

	@Override
	protected Node generateSubXML(Entity entity) {
		EmailAddress address = (EmailAddress) entity;
		Element root = new Element("EmailAddress",EmailAddress.NAMESPACE);
		addSimpleNode(root,"address",address.getAddress(),EmailAddress.NAMESPACE);
		addSimpleNode(root,"context",address.getContext(),EmailAddress.NAMESPACE);
		return root;
	}

}
