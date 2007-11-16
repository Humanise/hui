package dk.in2isoft.onlineobjects.ui;

import dk.in2isoft.onlineobjects.core.EndUserException;

public abstract class SimpleWindow extends Interface {

	protected static String ALIGN_CENTER = "center";
	
	protected String title;
	protected String icon;
	protected String width;
	protected String align;
	protected boolean background;
	protected String closeLink;
	
	protected SimpleWindow(String[] components) {
		super(components);
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) throws EndUserException {
		gui.append(
		"<interface background='Desktop'>"+
        "<window xmlns='uri:Window'");
		addAttribute(gui,"width",width);
		addAttribute(gui,"align",align);
		gui.append(" top='30'>"+
        "<titlebar title='"+escape(title)+"'");
		addAttribute(gui,"icon",icon);
		gui.append(">");
		if (closeLink!=null) {
			gui.append("<close link='").append(closeLink).append("'/>");
		}
		gui.append("</titlebar>");
		buildWindowToolbar(gui);
        gui.append("<content padding='5'");
		addAttribute(gui,"background",background);
		gui.append(">");
		buildWindowContents(gui);
		gui.append("</content></window></interface>");

	}

	protected abstract void buildWindowContents(StringBuilder gui) throws EndUserException;
	
	protected void buildWindowToolbar(StringBuilder gui) throws EndUserException {
		
	}
}
