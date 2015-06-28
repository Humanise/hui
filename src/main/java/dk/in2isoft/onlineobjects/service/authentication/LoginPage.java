package dk.in2isoft.onlineobjects.service.authentication;

import java.io.File;

import nu.xom.Element;
import nu.xom.Node;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterfaceAdapter;

public class LoginPage extends XSLTInterfaceAdapter {

	private File stylesheet;
	private User currentUser;
	private String redirect;
	private String action;

	public LoginPage(AuthenticationControllerBase controller, Request request) throws EndUserException {
		super();
		stylesheet = controller.getFile("xslt", "login.xsl");
		currentUser = request.getSession().getUser();
		redirect = request.getString("redirect");
		action = request.getString("action");
	}

	@Override
	public File getStylesheet() {
		return stylesheet;
	}

	@Override
	protected void buildContent(Element parent) throws ModelException {
		parent.appendChild(create("redirect", redirect));
		parent.appendChild(create("action", action));
		Node userNode = convertToNode(currentUser);
		parent.appendChild(userNode);
	}
	

}
