package dk.in2isoft.onlineobjects.model.conversion;

import nu.xom.Element;
import nu.xom.Node;
import nu.xom.Text;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.User;

public class UserConverter extends EntityConverter {

	@Override
	protected Node generateSubXML(Entity entity) {
		User user = (User) entity;
		Element root = new Element("User",User.NAMESPACE);
		Element username = new Element("username",User.NAMESPACE);
		username.appendChild(new Text(user.getUsername()));
		root.appendChild(username);
		return root;
	}

}
