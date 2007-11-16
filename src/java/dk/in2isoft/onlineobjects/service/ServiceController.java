package dk.in2isoft.onlineobjects.service;

import java.io.IOException;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.ui.Request;

public abstract class ServiceController {

	public ServiceController() {
		super();
	}
	
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		
	}

	protected ModelFacade getModel() {
		return Core.getInstance().getModel();
	}
}
