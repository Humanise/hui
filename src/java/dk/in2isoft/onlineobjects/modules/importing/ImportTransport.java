package dk.in2isoft.onlineobjects.modules.importing;

import dk.in2isoft.onlineobjects.modules.importing.ImportSession.Status;

public interface ImportTransport {

	void start();
	
	Status getStatus();
	
	Object getResult();
}
