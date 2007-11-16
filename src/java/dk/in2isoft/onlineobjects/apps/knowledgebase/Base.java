package dk.in2isoft.onlineobjects.apps.knowledgebase;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class Base extends Interface {

	public Base() {
		super(new String[]{"Layout","Frame"});
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) 
	throws EndUserException {
		gui.append("<interface background='Desktop'>"+
        "<layout xmlns='uri:Layout' width='100%' height='100%' spacing='10'>"+
		"<row><cell width='250'>"+
		"<iframe xmlns='uri:Frame' source='left' name='Left'/>"+
		"</cell><cell>"+
		"<iframe xmlns='uri:Frame' source='right' name='Right'/>"+
		"</cell></row>"+
		"</layout>"+
        "</interface>"
		);
	}

}
