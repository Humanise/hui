package dk.in2isoft.onlineobjects.apps.desktop;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.importing.ImportListerner;
import dk.in2isoft.onlineobjects.ui.Request;

public class FileImporter implements ImportListerner {

	public void processFile(File file, String mimeType, String name,Map<String, String> parameters, Request request)
			throws IOException, EndUserException {
		System.out.println(file.getName());
	}

	public String getProcessName() {
		return "fileImport";
	}

}
