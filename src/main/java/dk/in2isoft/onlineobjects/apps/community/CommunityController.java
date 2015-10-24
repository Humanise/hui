package dk.in2isoft.onlineobjects.apps.community;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletResponse;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.modules.images.ImageImporter;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.importing.ImportListener;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.GraphService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.services.PageRenderingService;
import dk.in2isoft.onlineobjects.services.WebModelService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterface;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class CommunityController extends ApplicationController {

	//private static Logger log = Logger.getLogger(CommunityController.class);

	private PrivateSpaceController privateSpaceController;
	private ImportService importService;
	private ImageService imageService;
	private FileService fileService; 
	private GraphService graphService;
	private SecurityService securityService;
	private WebModelService webModelService;
	private HTMLService htmlService;

	private static CommunityDAO dao = new CommunityDAO();

	public CommunityController() {
		super("community");
		addJsfMatcher("/about", "about/index.xhtml");
		addJsfMatcher("/<username>/remote.html", "user/remote.xhtml");
		addJsfMatcher("/<username>/images.html", "user/images.xhtml");
		addJsfMatcher("/<username>/images/<integer>.html", "user/image.xhtml");
		addJsfMatcher("/<username>", "user/index.xhtml");
		addJsfMatcher("/", "index.xhtml");
		addJsfMatcher("/recoverpassword.html", "recoverpassword.xhtml");
		addJsfMatcher("/invitation.html", "invitation.xhtml");
		addJsfMatcher("/invitation.html", "invitation.xhtml");
	}
	
	@Override
	public List<Locale> getLocales() {
		return null;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		super.afterPropertiesSet();
	}

	public static CommunityDAO getDAO() {
		return dao;
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		String subDomain = request.getSubDomain();
		if (Strings.isNotBlank(subDomain) && !"www".equals(subDomain)) {
			handleUser(request);
		} else if (request.testLocalPathStart("favicon.ico")) {
			throw new ContentNotFoundException();
		} else if (request.testLocalPathStart("model.action")) {
			model(request);
		} else if (request.testLocalPathStart("iphone")) {
			FileBasedInterface ui = new FileBasedInterface(getFile("iphone", "index.gui.xml"));
			ui.render(request.getRequest(), request.getResponse());
		} else if (request.testLocalPathStart(new String[] { null })) {
			handleUser(request);
		} else {
			throw new ContentNotFoundException();
		}
	}

	public void invitation(Request request) throws IOException, EndUserException {
		XSLTInterface ui = new InvitationPage(this, request);
		ui.display(request);
	}

	private void handleUser(Request request) throws IOException, EndUserException {
		String subDomain = request.getSubDomain();
		if (Strings.isNotBlank(subDomain) && !"www".equals(subDomain)) {
			User siteUser = modelService.getUser(subDomain);
			if (siteUser == null) {
				throw new ContentNotFoundException("The user does not excist!");
			}
			if (request.testLocalPathFull("uploadImage")) {
				if (siteUser.getId() != request.getSession().getUser().getId()) {
					throw new SecurityException("User cannot access this private site");
				}
				uploadImage(request);
			} else {
				displayUserSite(siteUser, request);
			}
		} else {
			User siteUser = modelService.getUser(request.getLocalPath()[0]);
			if (siteUser == null) {
				throw new ContentNotFoundException("The user does not excist!");
			}
			if (request.testLocalPathFull(null, "site", "uploadImage")) {
				if (siteUser.getId() != request.getSession().getUser().getId()) {
					throw new SecurityException("User cannot access this private site");
				}
				uploadImage(request);
			} else if (request.testLocalPathFull(null, "uploadProfileImage")) {
				if (siteUser.getId() != request.getSession().getUser().getId()) {
					throw new SecurityException("User cannot access this private site");
				}
				uploadProfileImage(request);
			} else if (request.testLocalPathStart(null, "private")) {
				if (siteUser.getId() != request.getSession().getUser().getId()) {
					throw new SecurityException("User cannot access this private site");
				}
				if (request.testLocalPathFull(null, "private")) {
					request.redirect("images.gui");
				} else if (request.testLocalPathFull(null, "private", "persons.gui")) {
					privateSpaceController.displayPersons(request);
				} else if (request.testLocalPathFull(null, "private", "images.gui")) {
					privateSpaceController.displayImages(request);
				} else if (request.testLocalPathFull(null, "private", "bookmarks.gui")) {
					privateSpaceController.displayBookmarks(request);
				} else if (request.testLocalPathFull(null, "private", "bookmarks_alone.gui")) {
					privateSpaceController.displayBookmarksAlone(request);
				} else if (request.testLocalPathFull(null, "private", "integration.gui")) {
					privateSpaceController.displayIntegration(request);
				} else if (request.testLocalPathFull(null, "private", "bookmarks", "import.action")) {
					importBookmarks(request);
				} else if (request.testLocalPathFull(null, "private", "images", "upload.action")) {
					importImage(request);
				} else if (request.testLocalPathFull(null, "private", "settings.gui")) {
					privateSpaceController.displaySettings(request);
				}
			} else if (request.testLocalPathFull(null, "site")) {
				displayUserSite(siteUser, request);
			} else {
				throw new ContentNotFoundException();
			}
		}
	}

	private void importBookmarks(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		dataImporter.setListener(new InternetAddressImporter(modelService,htmlService));
		dataImporter.importMultipart(this, request);
		request.getResponse().setStatus(HttpServletResponse.SC_OK);
		request.getResponse().getWriter().write("OK");
	}

	private void importImage(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		dataImporter.setListener(new ImageImporter(modelService,imageService));
		dataImporter.importMultipart(this, request);
	}

	private void displayUserSite(User user, Request request) throws EndUserException {
		WebSite site = webModelService.getUsersWebSite(user);
		if (site == null) {
			throw new ContentNotFoundException("The user does not have a web site!");
		}
		if (!securityService.canView(site, request.getSession())) {
			throw new SecurityException("The current user is not allowed to view this web site");
		}
		WebPage page = null;
		if (request.getInt("id") > 0) {
			page = webModelService.getPageForWebNode(request.getInt("id"),request.getSession());
		} else {
			page = webModelService.getWebSiteFrontPage(site);
		}
		if (page == null) {
			throw new EndUserException("The page could not be found!");
		}
		PageRenderingService renderer = request.getBean(PageRenderingService.class);
		renderer.render(page,request);
	}

	private void uploadProfileImage(Request request) throws EndUserException, IOException {
		DataImporter dataImporter = importService.createImporter();
		ImageImporter listener = new ProfileImageImporter(modelService,imageService,securityService);
		dataImporter.setListener(listener);
		dataImporter.importMultipart(this, request);
	}

	private void uploadImage(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		ImportListener<?> listener = new ImageGalleryImporter(modelService,imageService);
		dataImporter.setListener(listener);
		dataImporter.importMultipart(this, request);
	}

	@Override
	public ApplicationSession createToolSession() {
		return new CommunitySession();
	}

	public void model(Request request) throws IOException, EndUserException {
		StringBuilder sb = new StringBuilder();
		sb.append("digraph {");
		sb.append("graph[normalize=true,packMode=\"node\",pad=1]");
		List<Long> added = Lists.newArrayList();

		Query<Relation> rq = Query.of(Relation.class).withPaging(0, 1000);
		List<Relation> relations = modelService.list(rq);
		for (Relation relation : relations) {
			Entity sub = relation.getTo();
			Entity supr = relation.getFrom();
			sb.append(supr.getId());
			sb.append(" -> ");
			sb.append(sub.getId());
			sb.append(" [ label = \"");
			if (relation.getKind() != null) {
				sb.append(relation.getKind());
			}
			sb.append(" ("+relation.getPosition()+")");
			sb.append("\" ];");
		}
		for (Relation relation : relations) {
			Entity child = relation.getTo();
			if (!added.contains(child.getId())) {
				sb.append(child.getId()).append(" [shape=box,fontname=\"Arial\",label=\"").append(
						child.getClass().getSimpleName());
				if (child.getName() != null && child.getName().length() > 0) {
					sb.append("\\n").append(child.getName());
				}
				sb.append("\"];");
				added.add(child.getId());
			}
			Entity parent = relation.getFrom();
			if (!added.contains(parent.getId())) {
				sb.append(parent.getId()).append(" [shape=box,fontname=\"Arial\",label=\"").append(
						parent.getClass().getSimpleName());
				if (parent.getName() != null && parent.getName().length() > 0) {
					sb.append("\\n").append(parent.getName());
				}
				sb.append("\"];");
				added.add(parent.getId());
			}
		}
		sb.append("}");
		String algorithm = request.getString("algorithm");
		if (!Strings.isNotBlank(algorithm)) {
			algorithm = "dot";
		}
		if (request.getBoolean("svg")) {
			request.getResponse().setContentType("image/svg+xml");
			graphService.convert(sb.toString(), algorithm, "svg", request.getResponse().getOutputStream());
		} else if (request.getBoolean("xdot")) {
			request.getResponse().setContentType("text/plain");
			graphService.convert(sb.toString(), algorithm, "xdot", request.getResponse().getOutputStream());
		} else if (request.getBoolean("jpg")) {
			request.getResponse().setContentType("image/jpeg");
			graphService.convert(sb.toString(), algorithm, "jpg", request.getResponse().getOutputStream());
		} else {
			request.getResponse().setContentType("image/png");
			graphService.convert(sb.toString(), algorithm, "png", request.getResponse().getOutputStream());
		}
	}

	public void setImportService(ImportService importService) {
		this.importService = importService;
	}

	public ImportService getImportService() {
		return importService;
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public ImageService getImageService() {
		return imageService;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}

	public void setGraphService(GraphService graphService) {
		this.graphService = graphService;
	}

	public GraphService getGraphService() {
		return graphService;
	}

	public void setPrivateSpaceController(PrivateSpaceController privateSpaceController) {
		this.privateSpaceController = privateSpaceController;
	}

	public PrivateSpaceController getPrivateSpaceController() {
		return privateSpaceController;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setWebModelService(WebModelService webModelService) {
		this.webModelService = webModelService;
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}
