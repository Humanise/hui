package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.ProgressListener;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.util.GraphUtil;
import dk.in2isoft.commons.util.ImageUtil;
import dk.in2isoft.commons.xml.XSLTUtil;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.model.util.WebModelUtil;
import dk.in2isoft.onlineobjects.publishing.PageRenderer;
import dk.in2isoft.onlineobjects.ui.AsynchronousProcessDescriptor;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterface;

public class CommunityController extends ApplicationController {

	private static Logger log = Logger.getLogger(CommunityController.class);

	private PrivateSpaceController privateSpaceController;
	private static CommunityDAO dao = new CommunityDAO();
	
	public CommunityController() {
		super("community");
		privateSpaceController = new PrivateSpaceController(this);
	}
	
	public static CommunityDAO getDAO() {
		return dao;
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		log.debug(request.getLocalPath().length);
		String[] path = request.getLocalPath();
		if (path.length >= 1) {
			handleUserSite(request);
		} else {
			XSLTInterface ui = new FrontPage(this, request);
			XSLTUtil.applyXSLT(ui, request);
		}
	}

	private void handleUserSite(Request request) throws IOException, EndUserException {
		String[] path = request.getLocalPath();
		String userName = path[0];
		User siteUser = Core.getInstance().getModel().getUser(userName);
		if (siteUser == null) {
			throw new EndUserException("The user does not excist!");
		}
		if (path.length == 2 && path[1].equals("uploadImage")) {
			uploadImage(request,siteUser);
		} else if (path.length == 2 && path[1].equals("private")) {
			handlePrivate(siteUser, request);
		} else {
			displayUserPage(siteUser, request);
		}
	}

	private void handlePrivate(User siteUser, Request request) throws IOException,EndUserException {
		if (siteUser.getId()!=request.getSession().getUser().getId()) {
			throw new SecurityException("User cannot access this private site");
		}
		privateSpaceController.dispatch(request);
	}

	private void displayUserPage(User user, Request request) throws EndUserException {
		WebSite site = WebModelUtil.getUsersWebSite(user);
		if (site == null) {
			throw new EndUserException("The user does not have a web site!");
		}
		WebPage page = null;
		if (request.getInt("id") > 0) {
			page = WebModelUtil.getPageForWebNode(request.getInt("id"));
		} else {
			page = WebModelUtil.getWebSiteFrontPage(site);
		}
		if (page == null) {
			throw new EndUserException("The page could not be found!");
		}
		PageRenderer renderer = new PageRenderer(page);
		renderer.render(request);
	}

	@SuppressWarnings("unchecked")
	private void uploadImage(Request request,User siteUser) throws IOException, EndUserException {
		// boolean isMultipart =
		ApplicationSession session = request.getSession().getToolSession("community");
		final AsynchronousProcessDescriptor process = session.createAsynchronousProcessDescriptor("imageUpload");
		if (!ServletFileUpload.isMultipartContent(request.getRequest())) {
			process.setError(true);
			throw new SecurityException("The request is not multi-part!");
		}

		if (request.getSession().getUser().getId() != siteUser.getId()) {
			process.setError(true);
			throw new SecurityException("The authenticated user does not have access to this site!");
		}
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setSizeThreshold(0);
		
		ServletFileUpload upload = new ServletFileUpload(factory);
		ProgressListener progressListener = new ProgressListener() {
			public void update(long pBytesRead, long pContentLength, int pItems) {
				if (pContentLength == -1) {
					process.setValue(0);
				} else {
					process.setValue((float) pBytesRead / (float) pContentLength);
				}

			}
		};
		upload.setProgressListener(progressListener);

		// Parse the request
		try {
			List<DiskFileItem> items = upload.parseRequest(request.getRequest());
			int imageGalleryId = 0;
			for (DiskFileItem item : items) {
				if (item.isFormField() && item.getFieldName() != null && item.getFieldName().equals("contentId")) {
					try {
						imageGalleryId = Integer.parseInt(item.getString());
					} catch (NumberFormatException e) {
						process.setError(true);
						throw new IllegalRequestException("the parameter contentId is not an int:" + item.getString());
					}
				}
			}
			for (DiskFileItem item : items) {
				if (!item.isFormField()) {
					try {
						processFile(item, imageGalleryId, request);
					} catch (Exception e) {
						process.setError(true);
						throw new EndUserException(e);
					}
				}
			}
		} catch (FileUploadException e) {
			process.setError(true);
			throw new EndUserException(e);
		}
		process.setCompleted(true);
	}

	private void processFile(DiskFileItem item, long imageGalleryId, Request request) throws IOException, EndUserException {
		Entity gallery = getModel().loadEntity(ImageGallery.class, imageGalleryId);
		if (gallery == null) {
			throw new EndUserException("Could not load gallery with ID=" + imageGalleryId);
		}
		File file = item.getStoreLocation();
		int[] dimensions = ImageUtil.getImageDimensions(file);
		Image image = new Image();
		getModel().saveItem(image,request.getSession());
		image.setName(item.getName());
		image.changeImageFile(file, dimensions[0],dimensions[1], item.getContentType());
		log.debug("width:" + image.getWidth());
		log.debug("height:" + image.getHeight());
		getModel().updateItem(image,request.getSession());
		Relation relation = new Relation(gallery, image);
		relation.setPosition(getMaxImagePosition(gallery) + 1);
		getModel().saveItem(relation,request.getSession());
	}

	private float getMaxImagePosition(Entity gallery) throws EndUserException {
		List<Relation> relations = getModel().getSubRelations(gallery);
		if (relations.size() > 0) {
			return relations.get(relations.size() - 1).getPosition();
		} else {
			return 0;
		}
	}

	@Override
	public ApplicationSession createToolSession() {
		return new CommunitySession();
	}

	public void model(Request request) throws IOException, EndUserException {
		StringBuilder sb = new StringBuilder();
		sb.append("digraph finite_state_machine {");
		sb.append("graph [");
		sb.append("normalize=true, outputorder=edgesfirst, overlap=false, pack=false");
		sb.append(",packmode=\"node\", sep=\"0.8\", splines=true, size=\"14,10\"");
		sb.append("]");

		List<Relation> relations = getModel().listRelations();
		for (Relation relation : relations) {
			Entity sub = relation.getSubEntity();
			Entity supr = relation.getSuperEntity();
			sb.append(supr.getId());
			sb.append(" -> ");
			sb.append(sub.getId());
			sb.append(" [ label = \"");
			if (relation.getKind() != null) {
				sb.append(relation.getKind());
			}
			sb.append("\" ];");
		}
		List<Entity> entities = getModel().listEntities();
		
		for (Entity entity : entities) {
			sb.append(entity.getId()).append(" [shape=box,fontname=\"Verdana\",label=\"").append(getModel().getSubject(entity).getClass().getSimpleName());
			if (entity.getName()!=null && entity.getName().length()>0) {
				sb.append("\\n").append(entity.getName());
			}
			sb.append("\"];");
		}
		sb.append("}");
		try {
			if (request.getBoolean("svg")) {
				String svg = GraphUtil.dotToSvg(sb.toString());
				request.getResponse().setContentType("image/svg+xml");
				request.getResponse().getWriter().print(svg);
			} else if (request.getBoolean("xdot")) {
				String dot = GraphUtil.dotToDot(sb.toString());
				request.getResponse().setContentType("text/plain");
				request.getResponse().getWriter().print(dot);
			} else {
				request.getResponse().setContentType("image/png");
				GraphUtil.dotToPNG(sb.toString(), request.getResponse().getOutputStream());
			}
		} catch (EndUserException e) {
			log.error("", e);
		}
	}
	
	public void invitation(Request request) throws IOException, EndUserException {
		XSLTInterface ui = new InvitationPage(this, request);
		ui.display(request);
	}
}
