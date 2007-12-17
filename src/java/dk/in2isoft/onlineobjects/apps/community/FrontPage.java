package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;

import nu.xom.Element;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterfaceAdapter;

public class FrontPage extends XSLTInterfaceAdapter {

	private File stylesheet;

	public FrontPage(CommunityController controller, Request request) throws EndUserException {
		super();
		stylesheet = controller.getFile("xslt", "front.xsl");
	}

	@Override
	public File getStylesheet() {
		return stylesheet;
	}

	@Override
	protected void buildContent(Element parent) {
	}

}
