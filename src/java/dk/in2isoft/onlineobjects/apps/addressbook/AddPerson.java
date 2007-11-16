package dk.in2isoft.onlineobjects.apps.addressbook;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class AddPerson extends Interface {

	private static String ui = "<interface background='Desktop'>"+
    "<window xmlns='uri:Window' width='400' align='center' top='30'>"+
    "<titlebar title='Add user' icon='Element/User'>"+
    "<close link='.'/>"+
    "</titlebar>"+
    "<content padding='5' background='true'>"+
    "<form xmlns='uri:Form' action='createPerson' method='post'>"+
    "<group size='Large'>"+
    "<textfield name='firstName' badge='First name:'/>"+
    "<textfield name='lastName' badge='Last name:'/>"+
    "<select name='sex' badge='Sex'>"+
    "<option value='' title='Unknown'/>"+
    "<option value='male' title='Male'/>"+
    "<option value='female' title='Female'/>"+
    "</select>"+
    "<buttongroup size='Large'>"+
    "<button title='Cancel' link='.'/>"+
    "<button title='Create' submit='true' style='Hilited'/>"+
    "</buttongroup>"+
    "</group>"+
    "</form>"+
    "</content>"+
    "</window>"+
    "</interface>";
	
	public AddPerson() {
		super(new String[]{"Window","Form"});
	}

	@Override
	public void buildBody(Request request,StringBuilder gui) 
	throws EndUserException {
		gui.append(ui);
	}

}
