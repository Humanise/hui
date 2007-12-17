package dk.in2isoft.onlineobjects.ui;

import java.io.IOException;

import dk.in2isoft.gui.XmlWebGui;
import dk.in2isoft.onlineobjects.core.EndUserException;

public abstract class Interface {

	private String[] components;

	protected Interface(String[] components) {
		super();
		this.components = components;
	}

	public void display(Request request) throws IOException, EndUserException {
		StringBuilder gui = new StringBuilder();
		gui.append("<xmlwebgui xmlns=\"uri:XmlWebGui\"><configuration path=\"");
		gui.append(request.getRelativePath());
		gui.append("\"/>");
		buildBody(request, gui);
		gui.append("</xmlwebgui>");
		XmlWebGui ui = new XmlWebGui();
		ui.display(gui.toString(), components, request.getResponse());
	}

	public abstract void buildBody(Request request, StringBuilder gui) throws EndUserException;

	protected String escape(String str) {
		return XmlWebGui.escape(str);
	}
	
	protected void addAttribute(StringBuilder gui,String name,String value) {
		if (value!=null) {
			gui.append(" ").append(name).append("='").append(value).append("'");
		}
	}
	
	protected void addAttribute(StringBuilder gui,String name,boolean value) {
		gui.append(" ").append(name).append("='").append((value ? "true" : "false")).append("'");
	}
}
