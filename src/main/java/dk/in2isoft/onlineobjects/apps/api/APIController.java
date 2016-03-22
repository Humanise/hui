package dk.in2isoft.onlineobjects.apps.api;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;
import com.google.gson.reflect.TypeToken;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.apps.reader.index.ReaderQuery;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Hypothesis;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Question;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.language.WordModification;
import dk.in2isoft.onlineobjects.service.language.TextAnalysis;
import dk.in2isoft.onlineobjects.ui.Request;

public class APIController extends APIControllerBase {

	@Path(expression = "/")
	public void front(Request request) throws IOException {

		FileBasedInterface ui = new FileBasedInterface(getFile("web", "front.gui.xml"));
		ui.render(request.getRequest(), request.getResponse());
	}

	@Path(start = { "v1.0", "language", "analyse" })
	public TextAnalysis analyse(Request request) throws IOException, EndUserException {
		String text = request.getString("text");
		String url = request.getString("url");
		if (Strings.isNotBlank(url)) {
			text = extractText(url);
		}
		return languageService.analyse(text);
	}

	@Path(start = { "v1.0", "html", "extract" })
	public void extractText(Request request) throws IOException, EndUserException {
		String url = request.getString("url", "An URL parameters must be provided");
		HttpServletResponse response = request.getResponse();
		response.setCharacterEncoding(Strings.UTF8);
		response.setContentType("text/plain");
		PrintWriter writer = response.getWriter();
		writer.write(extractText(url));
	}
    
	@Path(start={"v1.0","authentication"})
	public ClientKeyResponse getSecret(Request request) throws IOException, EndUserException {
		String username = request.getString("username");
		String password = request.getString("password");
		String clientId = request.getString("client");
		
		User user = securityService.getUser(username, password);
		if (user==null) {
			try {
				Thread.sleep(1500);
			} catch (InterruptedException e) {
				
			}
			throw new SecurityException("User not found");
		}
		String secret = user.getPropertyValue(Property.KEY_AUTHENTICATION_SECRET);

		ClientKeyResponse response = new ClientKeyResponse();
		response.setSecret(secret);
		return response;
	}
	
	@Path(start={"v1.0","validateClient"})
	public void validateClient(Request request) throws IOException, EndUserException {
		String clientId = request.getString("client");
		
		User user = securityService.getUserBySecret(clientId);
		if (user==null) {
			throw new SecurityException("User not found");
		}
	}
	
	@Path(start={"v1.0","bookmark"})
	public void bookmark(Request request) throws IOException, EndUserException {
		String url = request.getString("url", "An URL parameters must be provided");
		String quote = request.getString("quote");
		String secret = request.getString("secret");

		// TODO Validate URL

		// System.out.println(url);
		// System.out.println(quote);
		// System.out.println(secret);

		User user = securityService.getUserBySecret(secret);
		if (user != null) {
			Query<InternetAddress> query = Query.after(InternetAddress.class).withPrivileged(user).withField(InternetAddress.FIELD_ADDRESS, url);
			InternetAddress address = modelService.search(query).getFirst();
			if (address == null) {
				address = new InternetAddress();
				address.setAddress(url);
				HTMLDocument doc = htmlService.getDocumentSilently(url);
				if (doc != null) {
					address.setName(doc.getTitle());
				} else {
					address.setName(Strings.simplifyURL(url));
				}
				modelService.createItem(address, user);

				inboxService.add(user, address);
			}
			if (Strings.isNotBlank(quote)) {
				Statement part = new Statement();
				part.setName(StringUtils.abbreviate(quote, 50));
				part.setText(quote);
				modelService.createItem(part, user);
				modelService.createRelation(address, part, Relation.KIND_STRUCTURE_CONTAINS, user);
			}
		} else {
			throw new SecurityException("No user found with that secret key");
		}
	}

	@Path(start = { "v1.0", "knowledge", "list" })
	public SearchResult<KnowledgeListRow> knowledgeList(Request request) throws IOException, EndUserException {
		User user = getUserForSecretKey(request);
		
		int page = request.getInt("page");
		int pageSize = request.getInt("pageSize");
		if (pageSize == 0) {
			pageSize = 30;
		}

		ReaderQuery query = new ReaderQuery();
		query.setPage(page);
		query.setPageSize(pageSize);
		query.setSubset("everything");
		query.setType(Lists.newArrayList("any"));
		query.setText(request.getString("text"));
		SearchResult<Entity> searchResult = readerSearcher.search(query, user);
		
		List<KnowledgeListRow> list = new ArrayList<>();
		for (Entity entity : searchResult.getList()) {
			KnowledgeListRow row = new KnowledgeListRow();
			row.id = entity.getId();
			row.type = entity.getClass().getSimpleName();
			if (entity instanceof InternetAddress) {
				InternetAddress address = (InternetAddress) entity;
				row.url = address.getAddress();
				row.text = address.getName();
			}
			else if (entity instanceof Statement) {
				row.text = ((Statement) entity).getText();
				Query<InternetAddress> q = Query.after(InternetAddress.class).to(entity, Relation.KIND_STRUCTURE_CONTAINS).withPrivileged(request.getSession());
				InternetAddress addr = modelService.search(q).getFirst();
				if (addr != null) {
					row.url = addr.getAddress();
				}
			}
			else if (entity instanceof Question) {
				row.text = ((Question) entity).getText();
			}
			else if (entity instanceof Hypothesis) {
				row.text = ((Hypothesis) entity).getText();
			}
			list.add(row);
		}
		return new SearchResult<>(list, searchResult.getTotalCount());
	}

	private User getUserForSecretKey(Request request) throws SecurityException {
		String secret = request.getString("secret");
		User user = securityService.getUserBySecret(secret);
		if (user==null) {
			throw new SecurityException("User not found");
		}
		return user;
	}

	@Path(start = { "v1.0", "words", "import" })
	public void importWord(Request request) throws IOException, EndUserException {
		getUserForSecretKey(request);
		Privileged privileged = securityService.getAdminPrivileged();
		WordModification modification = request.getObject("modification", WordModification.class);
		Type listType = new TypeToken<List<WordModification>>() {}.getType();
		List<WordModification> modifications = request.getObject("modifications", listType);
		if (modification!=null) {
			wordService.updateWord(modification , privileged);
		} else if (Code.isNotEmpty(modifications)) {
			for (WordModification wordModification : modifications) {
				wordService.updateWord(wordModification , privileged);
			}
		} else {
			throw new IllegalRequestException("No modifications provided");
		}
		
	}

	private String extractText(String url) {
		HTMLDocument doc = htmlService.getDocumentSilently(url);
		if (doc == null) {
			return null;
		}
		return doc.getExtractedText();
	}
}
