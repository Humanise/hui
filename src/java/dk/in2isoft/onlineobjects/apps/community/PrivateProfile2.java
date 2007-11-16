package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterface;

public class PrivateProfile2 extends XSLTInterface {
	
	private String data;
	private File stylesheet;
	
	public PrivateProfile2(CommunityController controller,Request request) throws EndUserException {
		super();
		User user = request.getSession().getUser();
		String userXML = Core.getInstance().getConverter().generateXML(user).toXML();
		stylesheet = controller.getFile(new String[] { "xslt", "private_profile.xsl" });
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
