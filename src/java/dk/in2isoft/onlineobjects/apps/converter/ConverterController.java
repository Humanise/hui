package dk.in2isoft.onlineobjects.apps.converter;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class ConverterController extends ApplicationController {

	public ConverterController() {
		super("converter");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		Interface gui = new Base();
		gui.display(request);
	}

}
