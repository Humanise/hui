package dk.in2isoft.onlineobjects.ui;

import dk.in2isoft.commons.util.StackTraceUtil;
import dk.in2isoft.onlineobjects.core.EndUserException;

public class ErrorDisplayer extends Interface {

	private EndUserException exception;
	
	public ErrorDisplayer() {
		super(new String[]{"Window","Message"});
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) {
		String title;
		String description;
		String error;
		if (exception!=null) {
			description=exception.getMessage();
			title=description.substring(description.indexOf(":")+1);
			error = StackTraceUtil.getStackTrace(exception);
		} else {
			title="";
			description = "";
			error = "";
		}
		gui.append("<interface background='Desktop'>"+
        "<window xmlns='uri:Window' width='800' align='center' top='30'>"+
        "<titlebar title='Fejlmeddelelse' icon='Basic/Close'/>"+
        "<content background='true'>"+
        "<message xmlns='uri:Message' icon='Error'>"+
		"<title>"+escape(title)+"</title>"+
		"<description>"+escape(description)+"</description>"+
		"<error badge='Show error'>"+escape(error)+"</error>"+
		"<buttongroup size='Large'>"+
		"<button title='Back' link='javascript: history.back();'/>"+
		"<button title='OK' link='"+request.getRelativePath()+"'/>"+
		"</buttongroup>"+
		"</message>"+
        "</content>"+
        "</window>"+
        "</interface>");
	}

	public void setEndUSerException(EndUserException exception) {
		this.exception = exception;
	}
}
