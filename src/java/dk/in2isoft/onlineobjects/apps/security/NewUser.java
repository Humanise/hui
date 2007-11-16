package dk.in2isoft.onlineobjects.apps.security;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class NewUser extends Interface {

	private static String ui = "<interface background='Desktop'>"+
    "<window xmlns='uri:Window' width='400' align='center' top='30'>"+
    "<titlebar title='Add user' icon='Element/User'>"+
    "<close link='.'/>"+
    "</titlebar>"+
    "<content padding='5' background='true'>"+
    "<form xmlns='uri:Form' action='createUser'>"+
    "<group size='Large'>"+
    "<textfield name='name' badge='Name:'/>"+
    "<buttongroup size='Large'>"+
    "<button title='Cancel' link='.'/>"+
    "<button title='Create' submit='true' style='Hilited'/>"+
    "</buttongroup>"+
    "</group>"+
    "</form>"+
    "</content>"+
    "</window>"+
    "</interface>";
	
	public NewUser() {
		super(new String[]{"Window","Form"});
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) 
	throws EndUserException {
		gui.append(ui);
	}

}
