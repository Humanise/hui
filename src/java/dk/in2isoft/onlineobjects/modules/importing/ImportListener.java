package dk.in2isoft.onlineobjects.modules.importing;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public interface ImportListener<T> {

	public void processFile(File file, String mimeType, String name, Map<String, String> parameters, Request request) throws IOException, EndUserException;

	public String getProcessName();

	public T getResponse();
}
