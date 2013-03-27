package dk.in2isoft.onlineobjects.apps.reader;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.data.ListWriter;
import dk.in2isoft.onlineobjects.apps.reader.perspective.ArticlePerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.FeedPerspective;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.feeds.Feed;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.modules.networking.NetworkResponse;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.ScriptWriter;
import dk.in2isoft.onlineobjects.ui.StylesheetWriter;


public class ReaderController extends ReaderControllerBase {


	@Path(expression="/script.[0-9]+.js")
	public void script(Request request) throws IOException, EndUserException {
		ScriptWriter writer = new ScriptWriter(request, configurationService);
		writer.write(publicScript);
	}

	@Path(expression="/style.[0-9]+.css")
	public void style(Request request) throws IOException, EndUserException {
		StylesheetWriter writer = new StylesheetWriter(request, configurationService);
		writer.write(publicStyle);
	}
	
	@Path
	public void listAddresses(Request request) throws IOException {
		
		int page = request.getInt("page");
		int pageSize = 30;

		ListWriter writer = new ListWriter(request);
		
		Query<InternetAddress> query = Query.after(InternetAddress.class).withPrivileged(request.getSession()).withPaging(page, 30);
		
		SearchResult<InternetAddress> result = modelService.search(query);
		
		writer.startList();
		writer.window(result.getTotalCount(), pageSize, page);
		
		writer.startHeaders();
		writer.header("Title").header("",1);
		writer.endHeaders();
		
		for (InternetAddress address : result.getList()) {
			writer.startRow().withId(address.getId());
			writer.startCell().startLine().text(address.getName()).endLine();
			writer.startLine().dimmed().minor().text(Strings.simplifyURL(address.getAddress())).endLine();
			writer.endCell();
			writer.startCell();
			writer.startIcons().startIcon().withAction().withIcon("monochrome/view").withData(address.getAddress()).endIcon().endIcons();
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}
	
	@Path
	public List<FeedPerspective> getFeeds(Request request) throws ModelException {
		UserSession session = request.getSession();
		Pile pile = getFeedPile(session);
		List<InternetAddress> children = modelService.getChildren(pile, InternetAddress.class, session);
		List<FeedPerspective> options = Lists.newArrayList();
		for (InternetAddress internetAddress : children) {
			options.add(new FeedPerspective(internetAddress.getName(), internetAddress.getId()));
		}
		return options;
	}

	private Pile getFeedPile(UserSession session) throws ModelException {
		return pileService.getOrCreateUsersPile("feeds", session.getUser(), session);
	}
	
	@Path
	public void addFeed(Request request) throws ModelException, IllegalRequestException, NetworkException {
		String url = request.getString("url");
		NetworkResponse response = null;
		try {
			response = networkService.get(url);
			if (response.isSuccess()) {
				Feed feed = feedService.parse(response.getFile());
				UserSession session = request.getSession();
				Pile feeds = getFeedPile(session);
				InternetAddress address = new InternetAddress();
				address.setName(feed.getTitle());
				address.setAddress(url);
				modelService.createItem(address, session);
				modelService.createRelation(feeds, address, session);
			}
		} catch (URISyntaxException e) {
			throw new IllegalRequestException("The URL is not well formed");
		} catch (IOException e) {
			throw new NetworkException("Unable to fetch "+url);
		} finally {
			if (response!=null) {
				response.cleanUp();
			}
		}
	}
	
	@Path
	public ArticlePerspective loadArticle(Request request) throws IOException, ModelException, SecurityException {
		Long id = request.getLong("id");
		
		UserSession session = request.getSession();
		InternetAddress address = modelService.get(InternetAddress.class, id, session);
				
		HTMLDocument document = getHTMLDocument(address, session);
		
		ArticlePerspective article = new ArticlePerspective();
		
		
		article.setInfo(buildInfo(document, address, session));
		article.setId(address.getId());
		if (document!=null) {
			article.setTitle(document.getTitle());
			article.setRendering(buildRendering(document, address));
		} else {
			article.setTitle(address.getName());
		}
		
		return article;
	}
	
	private HTMLDocument getHTMLDocument(InternetAddress address, Privileged privileged) throws SecurityException, ModelException {
		
		File folder = storageService.getItemFolder(address);
		File original = new File(folder,"original");
		String encoding = address.getPropertyValue(Property.KEY_INTERNETADDRESS_ENCODING);
		if (Strings.isBlank(encoding)) {
			encoding = Strings.UTF8;
		}
		if (!original.exists()) {
			NetworkResponse response = networkService.getSilently(address.getAddress());
			if (response!=null && response.isSuccess()) {
				File temp = response.getFile();
				if (!Files.copy(temp,original)) {
					response.cleanUp();
					return null;
				}
				address.overrideFirstProperty(Property.KEY_INTERNETADDRESS_ENCODING, encoding);
				modelService.updateItem(address, privileged);
			}
		}
		return new HTMLDocument(Files.readString(original, encoding));
	}

	private String buildInfo(HTMLDocument document, InternetAddress address, UserSession session) throws ModelException {
		HTMLWriter writer = new HTMLWriter();
		writer.startH1().text(address.getName()).endH1();
		writer.startP().withClass("link").startA().withHref(address.getAddress()).text(address.getAddress()).endA().endP();
		writer.startP().withClass("tags");
		{
			List<String> tags = address.getPropertyValues(Property.KEY_COMMON_TAG);
			if (!tags.isEmpty()) {
				for (String string : tags) {
					writer.startVoidA().withClass("tag").withData(string).text(string).endA().text(" ");
				}
			}
		}
		{
			User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
			List<Word> words = modelService.getChildren(address, Word.class,admin);
			for (Word word : words) {
				if (word==null || address==null) {
					continue;
				}
				writer.startVoidA().withData(word.getId()).withClass("word");
				writer.text(word.getText()).endA().text(" ");
			}

		}
		writer.startA().withClass("add").text("Add word").endA();
		writer.endP();
		
		return writer.toString();
	}

	private String buildRendering(HTMLDocument document, InternetAddress address) {
		String content = document.getExtractedContents();
		
		HTMLWriter writer = new HTMLWriter();
		
		if (Strings.isNotBlank(content)) {
			String[] lines = StringUtils.split(content, "\n");
			writer.startDiv().withClass("body");
			for (int i = 0; i < lines.length; i++) {
				writer.startP().text(lines[i]).endP();
			}
			writer.endDiv();
		}
		return writer.toString();
	}

	@Path
	public void addWord(Request request) throws ModelException {
		Long internetAddressId = request.getLong("internetAddressId");
		Long wordId = request.getLong("wordId");
		UserSession session = request.getSession();
		InternetAddress internetAddress = modelService.get(InternetAddress.class, internetAddressId, session);
		Word word = modelService.get(Word.class, wordId, session);
		modelService.createRelation(internetAddress, word, session);
	}
	
	@Path
	public WordListPerspective getWordInfo(Request request) throws ModelException {
		WordListPerspectiveQuery query = new WordListPerspectiveQuery();
		query.withIds(Lists.newArrayList(request.getLong("id")));
		WordListPerspective perspective = modelService.search(query).getFirst();
		if (perspective!=null) {
			
		}
		return perspective;
	}
	
}
