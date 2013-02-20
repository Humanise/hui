package dk.in2isoft.onlineobjects.ui;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class ScriptWriter {

	private ConfigurationService configurationService;
	private PrintWriter writer;
	
	public ScriptWriter(Request request, ConfigurationService configurationService) throws IOException {
		HttpServletResponse response = request.getResponse();
		response.setContentType("text/javascript");
		this.writer = response.getWriter();
		this.configurationService = configurationService;
	}
	
	public void write(String... path) {
		File file = configurationService.getFile(path);
		String contents = Files.readString(file);
		writer.write("\n\n/*** "+path[path.length-1]+" ***/\n\n");
		writer.write(contents);
		
	}

}
