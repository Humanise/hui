package dk.in2isoft.onlineobjects.modules.importing;

import dk.in2isoft.onlineobjects.core.SubSession;

public class ImportSession extends SubSession {

	public static enum Status {waiting,transferring,processing,success,failure}
		
	private ImportTransport transport;

	public Status getStatus() {
		return transport.getStatus();
	}
	
	public void start() {
		transport.start();
	}
	
	public void startInBackground() {
		Thread thread = new Thread(new Runnable() {
			public void run() {
				start();
			}
		});
		thread.setDaemon(true);
		thread.start();
	}

	public void setTransport(ImportTransport handler) {
		this.transport = handler;
	}
	
	public ImportTransport getTransport() {
		return transport;
	}
}
