package dk.in2isoft.onlineobjects.ui;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class StylesheetWriter {

	private ConfigurationService configurationService;
	private PrintWriter writer;
	private String context;
	
	public StylesheetWriter(Request request, ConfigurationService configurationService) throws IOException {
		HttpServletResponse response = request.getResponse();
		response.setContentType("text/css");
		this.context = request.getBaseContext();
		this.writer = response.getWriter();
		this.configurationService = configurationService;
	}
	
	public void write(String... path) {
		File file = configurationService.getFile(path);
		String contents = Files.readString(file);
		if (ArrayUtils.contains(path, "apps")) {
			contents = StringUtils.replace(contents, "../", "style/");
		}
		if (ArrayUtils.contains(path, "hui")) {
			
			contents = StringUtils.replace(contents, "../", context+"/hui/");
		}
		writer.write("\n\n/*** "+path[path.length-1]+" ***/\n\n");
		writer.write(contents);
		
	}

}
