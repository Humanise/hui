package dk.in2isoft.onlineobjects.apps;

import java.util.HashMap;
import java.util.Map;

import dk.in2isoft.onlineobjects.ui.AsynchronousProcessDescriptor;

public class ApplicationSession {

	private Map<String, AsynchronousProcessDescriptor> asynchronousProcesses;
	
	public ApplicationSession() {
		super();
		asynchronousProcesses = new HashMap<String, AsynchronousProcessDescriptor>();
	}

	public AsynchronousProcessDescriptor getAsynchronousProcessDescriptor(String key) {
		return this.asynchronousProcesses.get(key);
	}

	public AsynchronousProcessDescriptor createAsynchronousProcessDescriptor(String key) {
		AsynchronousProcessDescriptor descriptor = new AsynchronousProcessDescriptor();
		this.asynchronousProcesses.put(key,descriptor);
		return descriptor;
	}
}
