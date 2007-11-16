package dk.in2isoft.onlineobjects.apps.knowledgebase;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class Empty extends Interface {

	public Empty() {
		super(new String[]{});
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) 
	throws EndUserException {
		gui.append("<interface background='Desktop'>"+
        "</interface>");
	}

}
