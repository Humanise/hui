package dk.in2isoft.onlineobjects.apps.api;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.service.language.TextAnalysis;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.ScriptWriter;


public class APIController extends APIControllerBase {


	@Path(expression="/script.[0-9]+.js")
	public void script(Request request) throws IOException, EndUserException {
		ScriptWriter writer = new ScriptWriter(request, configurationService);
		writer.write(publicScript);
	}

	@Path(expression="/")
	public void front(Request request) throws IOException {

		FileBasedInterface ui = new FileBasedInterface(getFile("web","front.gui.xml"));
		ui.render(request.getRequest(), request.getResponse());
	}

	@Path(start={"v1.0","language","analyse"})
	public TextAnalysis analyse(Request request) throws IOException, EndUserException {
		String text = request.getString("text");
		String url = request.getString("url");
		if (Strings.isNotBlank(url)) {
			text = extractText(url);
		}
		return languageService.analyse(text);
	}
	
	@Path(start={"v1.0","html","extract"})
	public void extractText(Request request) throws IOException, EndUserException {
		String url = request.getString("url", "An URL parameters must be provided");
		HttpServletResponse response = request.getResponse();
		response.setCharacterEncoding(Strings.UTF8);
		response.setContentType("text/plain");
		PrintWriter writer = response.getWriter();
		writer.write(extractText(url));
	}
	
	private String extractText(String url) {
		HTMLDocument doc = htmlService.getDocumentSilently(url);
		if (doc==null) {
			return null;
		}
		return doc.getExtractedContents();
	}
}
