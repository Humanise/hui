package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.util.List;

import nu.xom.Element;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.ui.XSLTInterfaceAdapter;

public class UserSite extends XSLTInterfaceAdapter {

	private File stylesheet;

	private User user;

	private WebSite site;

	public UserSite(CommunityController controller, User user) throws EndUserException {
		super();
		this.stylesheet = controller.getFile("xslt", "user.xsl");
		this.user = user;
		site = getUsersWebsite(user);
	}

	private WebSite getUsersWebsite(User user) throws EndUserException {
		ModelService model = Core.getInstance().getModel();
		WebSite webSite = null;
		List<Relation> userSubs = model.getChildRelations(user);
		for (Relation relation : userSubs) {
			if (relation.getSubEntity().getType().equals(WebSite.TYPE)) {
				webSite = (WebSite) model.get(WebSite.class, relation.getSubEntity().getId());
			}
		}
		if (webSite == null) {
			throw new EndUserException("The user " + user.getUsername() + " has no website");
		} else {
			return webSite;
		}
	}

	@Override
	public File getStylesheet() {
		return stylesheet;
	}

	@Override
	protected void buildContent(Element parent) throws ModelException {
		parent.appendChild(convertToNode(user));
		parent.appendChild(convertToNode(site));
	}

}
