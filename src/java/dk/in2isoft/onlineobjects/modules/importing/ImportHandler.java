package dk.in2isoft.onlineobjects.modules.importing;

import dk.in2isoft.onlineobjects.modules.importing.ImportSession.Status;

public interface ImportHandler {

	void start();
	
	Status getStatus();
}
