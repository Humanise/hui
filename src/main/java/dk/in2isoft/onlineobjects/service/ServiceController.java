package dk.in2isoft.onlineobjects.service;

import dk.in2isoft.onlineobjects.ui.AbstractController;

public abstract class ServiceController extends AbstractController {

	public ServiceController(String name) {
		super(name);
	}
	
	@Override
	protected String getDimension() {
		return "services";
	}
		
}
