package dk.in2isoft.onlineobjects.modules.importing;

import dk.in2isoft.onlineobjects.core.SubSession;

public class ImportSession extends SubSession {

	public static enum Status {waiting,transferring,processing,success,failure}
		
	private ImportHandler handler;

	public Status getStatus() {
		return handler.getStatus();
	}
	
	public void start() {
		handler.start();
	}
	
	public void setHandler(ImportHandler handler) {
		this.handler = handler;
	}
	
	public ImportHandler getHandler() {
		return handler;
	}
}
