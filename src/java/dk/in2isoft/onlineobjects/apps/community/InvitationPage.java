package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.util.List;

import nu.xom.Attribute;
import nu.xom.Element;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Invitation;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterfaceAdapter;

public class InvitationPage extends XSLTInterfaceAdapter {

	private File stylesheet;

	private Invitation invitation;

	private User inviterUser;

	private Person inviterPerson;

	private Person person;

	private EmailAddress email;

	public InvitationPage(CommunityController controller, Request request) throws EndUserException {
		super();
		stylesheet = controller.getFile("xslt", "invitation.xsl");

		ModelService model = Core.getInstance().getModel();
		String code = request.getString("code");
		Query<Invitation> query = new Query<Invitation>(Invitation.class).withField("code", code);
		List<Invitation> items = model.list(query);
		if (items.size() > 0) {
			invitation = items.get(0);
			// Get inviter
			inviterUser = (User) model.getParent(invitation, User.class);
			// Get person of inviter
			inviterPerson = (Person) model.getChild(inviterUser, Person.class);
			// Get invited
			person = (Person) model.getChild(invitation, Person.class);
			// Get mail of invited
			email = (EmailAddress) model.getChild(person, EmailAddress.class);
		}
	}

	@Override
	public void buildContent(Element parent) throws ModelException {
		if (invitation==null) {
			Element error = createPageNode(parent, "error");
			error.addAttribute(new Attribute("key", "notfound"));
		}
		else if (!Invitation.STATE_ACTIVE.equals(invitation.getState())) {
			Element error = createPageNode(parent, "error");
			error.addAttribute(new Attribute("key", invitation.getState()));
		} else {
			Element root = create("invitation");
			parent.appendChild(root);
			root.appendChild(create("code", invitation.getCode()));
			root.appendChild(create("message", invitation.getMessage()));

			Element inviter = createPageNode(root, "inviter");
			inviter.appendChild(convertToNode(inviterUser));
			inviter.appendChild(convertToNode(inviterPerson));

			Element invited = createPageNode(root, "invited");
			invited.appendChild(convertToNode(person));
			invited.appendChild(convertToNode(email));
		}
	}

	@Override
	public File getStylesheet() {
		return stylesheet;
	}

}
