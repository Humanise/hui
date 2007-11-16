package dk.in2isoft.onlineobjects.model.conversion;

import nu.xom.Element;
import nu.xom.Node;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.WebSite;

public class WebSiteConverter extends EntityConverter {

	@Override
	protected Node generateSubXML(Entity entity) {
		WebSite webSite = (WebSite) entity;
		webSite.getIcon();
		Element root = new Element("WebSite",WebSite.NAMESPACE);
		return root;
	}

}
