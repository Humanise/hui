package dk.in2isoft.onlineobjects.apps.converter;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class Base extends Interface {

	public Base() {
		super(new String[]{"Window","Form"});
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) 
	throws EndUserException {
		gui.append("<interface background=\"Desktop\">"+
        "<window xmlns='uri:Window' width='600' align='center' top='30'>"+
        "<titlebar title='Setup' icon='Basic/Build'/>"+
        "<content padding='5' background='true'>"+
        "<form xmlns='uri:Form' target='_blank' action='../../service/ooconverter/'>"+
        "<group size='Large'>"+
        "<textfield badge='URL:' name='url'/>"+
        "<select badge='Format:' name='sourceformat'>"+
        "<option title='Microsoft Word' value='doc'/>"+
        "<option title='Microsoft PowerPoint' value='ppt'/>"+
        "</select>"+
        "<select badge='Format:' name='targetformat'>"+
        "<option title='HTML' value='html'/>"+
        "<option title='PDF' value='pdf'/>"+
        "<option title='SVG' value='svg'/>"+
        "<option title='Microsoft Word' value='doc'/>"+
        "<option title='Microsoft PowerPoint' value='ppt'/>"+
        "</select>"+
        "<buttongroup size='Large'>"+
        "<button title='Convert' submit='true' style='Hilited'/>"+
        "</buttongroup>"+
        "</group>"+
        "</form>"+
        "</content>"+
        "</window>"+
        "</interface>");
	}

}
