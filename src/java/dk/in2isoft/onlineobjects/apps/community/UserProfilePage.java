package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.util.List;

import nu.xom.Element;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterfaceAdapter;

public class UserProfilePage extends XSLTInterfaceAdapter {

	private File stylesheet;
	private User user;

	public UserProfilePage(CommunityController controller, User user, Request request) throws EndUserException {
		super();
		this.user = user;
		stylesheet = controller.getFile("xslt", "profile.xsl");
	}

	@Override
	public File getStylesheet() {
		return stylesheet;
	}

	@Override
	protected void buildContent(Element parent) {
		
		Element profile = createPageNode(parent, "profile");
		appendEntity(profile,user);
		try {
			ModelFacade model = Core.getInstance().getModel();
			Person person = model.getChild(user, Relation.KIND_SYSTEM_USER_SELF, Person.class);
			appendEntity(profile, person);

			Element images = createPageNode(parent,"images");			
			Query<Image> query = new Query<Image>(Image.class).withPriviledged(user);
			List<Image> search = model.search(query);
			for (Image image : search) {
				appendEntity(images, image);
			}
		} catch (ModelException e) {
			e.printStackTrace();
		}
	}

	private void appendEntity(Element parent, Entity entity) {
		parent.appendChild(convertToNode(entity));
	}
	
	

}
