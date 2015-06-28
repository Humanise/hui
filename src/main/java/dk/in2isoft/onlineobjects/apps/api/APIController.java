package dk.in2isoft.onlineobjects.apps.api;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.HtmlPart;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
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
	
	@Path(start={"v1.0","bookmark"})
	public void bookmark(Request request) throws IOException, EndUserException {
		String url = request.getString("url", "An URL parameters must be provided");
		String quote = request.getString("quote");
		String secret = request.getString("secret");
		
		// TODO Validate URL
		
		System.out.println(url);
		System.out.println(quote);
		System.out.println(secret);
				
		User user = securityService.getUserBySecret(secret);
		if (user!=null) {
			Query<InternetAddress> query = Query.after(InternetAddress.class).withPrivileged(user).withField(InternetAddress.FIELD_ADDRESS, url);
			InternetAddress address = modelService.search(query).getFirst();
			if (address==null) {
				address = new InternetAddress();
				address.setAddress(url);
				HTMLDocument doc = htmlService.getDocumentSilently(url);
				if (doc!=null) {
					address.setName(doc.getTitle());
				} else {
					address.setName(Strings.simplifyURL(url));
				}
				modelService.createItem(address, user);
				
				inboxService.add(user, address);
			}
			if (Strings.isNotBlank(quote)) {
				HtmlPart part = new HtmlPart();
				part.setName(StringUtils.abbreviate(quote, 50));
				part.setHtml(quote);
				modelService.createItem(part, user);
				modelService.createRelation(address, part, Relation.KIND_STRUCTURE_CONTAINS, user);
			}
		} else {
			throw new SecurityException("No user found with that secret key");
		}
}
	
	private String extractText(String url) {
		HTMLDocument doc = htmlService.getDocumentSilently(url);
		if (doc==null) {
			return null;
		}
		return doc.getExtractedContents();
	}
}
