package dk.in2isoft.onlineobjects.apps.addressbook;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class EditPerson extends Interface {
	
	private Person person;
	
	public EditPerson(Person person) {
		super(new String[]{"Window","Form"});
		this.person = person;
	}

	@Override
	public void buildBody(Request request,StringBuilder gui) 
	throws EndUserException {
		String sex = "";
		if (person.getSex()!=null) {
			sex = (person.getSex() ? "male" : "female");
		}
		gui.append("<interface background='Desktop'>"+
			    "<window xmlns='uri:Window' width='400' align='center' top='30'>"+
			    "<titlebar title='Edit person' icon='Element/User'>"+
			    "<close link='.'/>"+
			    "</titlebar>"+
			    "<content padding='5' background='true'>"+
			    "<form xmlns='uri:Form' action='updatePerson' method='post'>"+
			    "<hidden name='id'>"+person.getId()+"</hidden>"+
			    "<group size='Large'>"+
			    "<textfield name='firstName' badge='First name:'>"+escape(person.getGivenName())+"</textfield>"+
			    "<textfield name='lastName' badge='Last name:'>"+escape(person.getFamilyName())+"</textfield>"+
			    "<select name='sex' badge='Sex' selected='"+sex+"'>"+
			    "<option value='' title='Unknown'/>"+
			    "<option value='male' title='Male'/>"+
			    "<option value='female' title='Female'/>"+
			    "</select>"+
			    "<buttongroup size='Large'>"+
			    "<button title='Delete' link='deletePerson?id="+person.getId()+"'/>"+
			    "<button title='Cancel' link='.'/>"+
			    "<button title='Update' submit='true' style='Hilited'/>"+
			    "</buttongroup>"+
			    "</group>"+
			    "</form>"+
			    "</content>"+
			    "</window>"+
			    "</interface>"
		);
	}

}
