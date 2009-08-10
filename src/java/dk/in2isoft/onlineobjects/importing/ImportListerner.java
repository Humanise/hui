package dk.in2isoft.onlineobjects.importing;

import java.io.File;
import java.io.IOException;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public interface ImportListerner {

	public void processFile(File file, String mimeType, String name, Request request) throws IOException, EndUserException;

	public String getProcessName();
}
