package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterface;

public class FrontPage extends XSLTInterface {
	
	private String data;
	private File stylesheet;
	
	public FrontPage(CommunityController controller,Request request) throws EndUserException {
		super();
		User user = request.getSession().getUser();
		String userXML = Core.getInstance().getConverter().generateXML(user).toXML();
		stylesheet = controller.getFile(new String[] { "xslt", "front.xsl" });
		data = "<?xml version='1.0'?><page xmlns='http://uri.onlineobjects.com/page/'>"+
		"<session>"+
		userXML+
		"</session>"+
		"</page>";
	}

	@Override
	public String getData() {
		return data;
	}

	@Override
	public File getStylesheet() {
		return stylesheet;
	}

}
