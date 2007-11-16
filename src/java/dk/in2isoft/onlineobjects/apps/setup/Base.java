package dk.in2isoft.onlineobjects.apps.setup;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class Base extends Interface {

	public Base() {
		super(new String[]{"Window","List"});
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) 
	throws EndUserException {
		gui.append("<interface background=\"Desktop\">"+
        "<window xmlns=\"uri:Window\" width=\"600\" align=\"center\" top=\"30\">"+
        "<titlebar title=\"Setup\" icon=\"Basic/Build\"/>"+
        "<content padding=\"5\">"+
        "<list xmlns=\"uri:List\" width=\"100%\">"+
        "<content>"+
        "<headergroup>"+
        "<header title=\"Name\"/>"+
        "<header title=\"Value\"/>"+
        "</headergroup>"+
        "<row>"+
        "<cell>Base directory</cell>"+
        "<cell>"+escape(Core.getInstance().getConfiguration().getBaseDir())+"</cell>"+
        "</row>"+
        "<row>"+
        "<cell>Base url</cell>"+
        "<cell>"+escape(Core.getInstance().getConfiguration().getBaseUrl())+"</cell>"+
        "</row>"+
        "</content>"+
        "</list>"+
        "</content>"+
        "</window>"+
        "</interface>");
	}

}
