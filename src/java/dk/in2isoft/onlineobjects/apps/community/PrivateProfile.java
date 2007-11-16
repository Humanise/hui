package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;

import dk.in2isoft.in2igui.AbstractInterface;
import dk.in2isoft.in2igui.CustomWidget;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public class PrivateProfile extends AbstractInterface {
	
	private CommunityController controller;
	
	public PrivateProfile(CommunityController controller,Request request) throws EndUserException {
		super();
		this.controller = controller;
		CustomWidget custom = new CustomWidget();
		custom.append("<view><toolbar><icon icon='common/smiley' title='Ny person' name='newPerson'/></toolbar></view>");
		add(custom);
	}
	
	public File getFile() {
		return controller.getFile("gui","private","profile.gui.xml");
	}
	
}
