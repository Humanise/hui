package dk.in2isoft.onlineobjects.apps.knowledgebase;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class Left extends Interface {

	public Left() {
		super(new String[]{"Area","Frame","Icon"});
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) 
	throws EndUserException {
		gui.append("<interface background='Desktop'>"+
        "<area xmlns='uri:Area' width='100%' height='100%'>"+
		"<titlebar title='Oversigt'/>"+
		"<content padding='3'>"+
		"<iframe xmlns='uri:Frame' source='selection'/>"+
		"</content>"+
		"<bottom>"+
		"<group xmlns='uri:Icon' size='1' spacing='5' titles='right'>"+
		"<row>"+
		"<icon title='Add topic' icon='Element/Folder' overlay='New' link='newTopic' target='Right'/>"+
		"</row>"+
		"</group>"+
		"</bottom>"+
		"</area>"+
        "</interface>");
	}

}
