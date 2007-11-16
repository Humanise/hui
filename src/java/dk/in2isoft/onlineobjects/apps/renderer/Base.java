package dk.in2isoft.onlineobjects.apps.renderer;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.SimpleWindow;

public class Base extends SimpleWindow {

	public Base() {
		super(new String[]{"Window","Form"});
		title="Renderer";
		width="600";
		align = ALIGN_CENTER;
		background = true;
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) 
	throws EndUserException {
	}

	@Override
	protected void buildWindowContents(StringBuilder gui) throws EndUserException {
		gui.append(
	        "<form xmlns='uri:Form' target='_blank' action='../../service/renderer/'>"+
	        "<group size='Large'>"+
	        "<textfield badge='URL:' name='url'/>"+
	        "<buttongroup size='Large'>"+
	        "<button title='Render!' submit='true' style='Hilited'/>"+
	        "</buttongroup>"+
	        "</group>"+
	        "</form>"
	    );
		
	}

}
