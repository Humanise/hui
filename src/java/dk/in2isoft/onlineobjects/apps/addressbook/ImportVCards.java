package dk.in2isoft.onlineobjects.apps.addressbook;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.SimpleWindow;

public class ImportVCards extends SimpleWindow {

	private static String ui = 
    "<form xmlns='uri:Form' action='uploadVCards' method='post' enctype='multipart/form-data'>"+
    "<group size='Large'>"+
    "<file name='file' badge='File:'/>"+
    "<buttongroup size='Large'>"+
    "<button title='Cancel' link='.'/>"+
    "<button title='Upload' submit='true' style='Hilited'/>"+
    "</buttongroup>"+
    "</group>"+
    "</form>";
	
	public ImportVCards() {
		super(new String[]{"Window","Form"});
		title="Import";
		icon = "File/Generic";
		width = "400";
		align = ALIGN_CENTER;
		closeLink = ".";
		background = true;
	}

	@Override
	protected void buildWindowContents(StringBuilder gui) throws EndUserException {
		gui.append(ui);
	}

}
