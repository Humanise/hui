package dk.in2isoft.onlineobjects.service.webrenderer;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

import dk.in2isoft.commons.http.FilePusher;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.ui.Request;

public class WebrendererController extends ServiceController {

	//private static Logger log = Logger.getLogger(WebrendererController.class);
	
	private ConfigurationService configurationService;
	
	public WebrendererController() {
		super("webrenderer");
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {

		String url = request.getParameter("url");
		if (url == null) {
			throw new IllegalArgumentException("Url not provided!");
		}
		String format = request.getString("format");
		String mime = "image/png";
		String extension = "png";
		if (format == null) {
			format = "PNG";
		} else if (format.equalsIgnoreCase("png")) {
			format = "PNG";
		} else if (format.equalsIgnoreCase("pdf")) {
			format = "PDF";
			extension = "pdf";
			mime = "application/pdf";
		} else {
			format = "PNG";
		}
		File tempFile = File.createTempFile(this.getClass().getSimpleName(), extension, configurationService.getTempDir());
		String tempPath = tempFile.getAbsolutePath();
		String cmd = "osascript "+configurationService.getBasePath()+"/WEB-INF/scripts/paparazzi.app  " + url + " " + format
		+ " " + tempPath;
		Process p = Runtime.getRuntime().exec(cmd);
		checkError(p);
		if (tempFile.length()==0) {
			throw new EndUserException("The produced file is empty");
		}
		FilePusher pusher = new FilePusher(tempFile);
		pusher.push(request.getResponse(), mime);
		tempFile.delete();
	}
	
	private void checkError(Process p) 
	throws EndUserException, IOException {
		InputStream s = p.getErrorStream();
		int c;
		StringWriter sw = new StringWriter();
		while ((c = s.read()) != -1) {
			sw.write(c);
		}
		if (sw.getBuffer().length()>0) {
			throw new EndUserException(sw.toString());
		}
		
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

}
