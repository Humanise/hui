package dk.in2isoft.onlineobjects.apps.security;

import java.util.List;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.SimpleWindow;

public class Base extends SimpleWindow {

	public Base() {
		super(new String[]{"Window","List","Toolbar"});
		super.title = "Security";
		super.icon = "Tool/Security";
		super.align = ALIGN_CENTER;
		super.width = "600";
	}

	@Override
	protected void buildWindowToolbar(StringBuilder gui) throws EndUserException {
		gui.append(
        "<toolbar xmlns='uri:Toolbar' align='center'>"+
        "<tool title='Add user' icon='Element/User' overlay='New' link='newUser'/>"+
        "</toolbar>"
        );
	}

	@Override
	protected void buildWindowContents(StringBuilder gui) throws EndUserException {
		gui.append(
        "<list xmlns='uri:List' width='100%'>"+
        "<content>"+
        "<headergroup>"+
        "<header title='Name'/>"+
        "<header title='Username'/>"+
        "<header title='ID'/>"+
        "</headergroup>"
        );
		listUsers(gui);
		gui.append(
        "</content>"+
        "</list>"
        );
	}
	
	private void listUsers(StringBuilder gui) throws ModelException {
		ModelService model = Core.getInstance().getModel();
        List<User> result = model.list(new Query<User>(User.class));
        for (User user : result) {
    		gui.append(
		    "<row link='editUser?id="+user.getId()+"'>"+
	        "<cell>"+
	        "<icon icon='"+user.getIcon()+"'/>"+
	        "<text>"+escape(user.getName())+"</text></cell>"+
	        "<cell>"+user.getUsername()+"</cell>"+
	        "<cell>"+user.getId()+"</cell>"+
	        "</row>"
	        );
		}
	}

}
