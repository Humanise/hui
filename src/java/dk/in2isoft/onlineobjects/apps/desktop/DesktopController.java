package dk.in2isoft.onlineobjects.apps.desktop;

import java.io.IOException;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.in2igui.data.KeyboardNavigatorItem;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.apps.community.remoting.InternetAddressInfo;
import dk.in2isoft.onlineobjects.apps.desktop.importing.FileImporter;
import dk.in2isoft.onlineobjects.apps.desktop.importing.ImportListener;
import dk.in2isoft.onlineobjects.apps.desktop.importing.UrlImporter;
import dk.in2isoft.onlineobjects.apps.desktop.perspectives.ImportPerspective;
import dk.in2isoft.onlineobjects.apps.desktop.perspectives.UserInfoPerspective;
import dk.in2isoft.onlineobjects.apps.desktop.perspectives.WidgetPerspective;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class DesktopController extends ApplicationController {
	
	private ImportService importService;
	private ImageService imageService;
	private FileService fileService;
	
	private static final Logger log = Logger.getLogger(DesktopController.class);

	public DesktopController() {
		super("desktop");
	}
	
	@Override
	public ApplicationSession createToolSession() {
		return new DesktopSession();
	}
	
	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		String[] localPath = request.getLocalPath();
		if (localPath.length==0) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","index.gui.xml"));
			ui.render(request.getRequest(), request.getResponse());
		} else {
			super.unknownRequest(request);
		}
	}
	
	@Path(start="getUserInfo")
	public void getUserInfo(Request request) throws IOException, EndUserException {
		if (request.isUser(SecurityService.PUBLIC_USERNAME)) {
			throw new SecurityException("This user does not have access");
		}
		UserInfoPerspective info = new UserInfoPerspective();
		info.setUsername(request.getSession().getUser().getUsername());
		request.sendObject(info);
	}
	
	@Path(start="importURL")
	public void importUrl(Request request) throws IOException {
		final String url = request.getString("url");
		ImportListener listener = new ImportListener();
		listener.setPrivileged(request.getSession());
		listener.setImageService(imageService);
		listener.setFileService(fileService);

		final ImportSession session = importService.createImportSession(request.getSession());
		
		UrlImporter handler = new UrlImporter(url,listener);
		handler.setConfigurationService(configurationService);
		session.setHandler(handler);
		Thread thread = new Thread(new Runnable() {
			public void run() {
				log.info("Starting import session of URL: "+url);
				session.start();
				log.info("Ending import session of URL: "+url);
			}
		});
		thread.setDaemon(true);
		thread.start();
		System.out.println("Start: "+session.getId()+" / "+session.getStatus());
		ImportPerspective info = new ImportPerspective(session);
		request.sendObject(info);
		System.out.println("Request finished");
	}

	@Path(start="uploadFile")
	public void uploadFile(Request request) throws IOException, EndUserException {
		ImportListener listener = new ImportListener();
		listener.setPrivileged(request.getSession());
		listener.setImageService(imageService);
		listener.setFileService(fileService);

		final ImportSession session = importService.createImportSession(request.getSession());
		FileImporter handler = new FileImporter();
		handler.setRequest(request);
		handler.setImportListener(listener);
		session.setHandler(handler);
		log.info("Starting upload");
		session.start();
		log.info("Upload finished");
		
		ImportPerspective info = new ImportPerspective(session);
		request.sendObject(info);
	}

	@Path(start="getImport")
	public void getImport(Request request) throws IOException {
		ImportSession session = importService.getImportSession(request.getString("id"));
		//System.out.println("Check: "+session.getId()+" / "+session.getStatus());
		ImportPerspective info = new ImportPerspective(session);
		
		request.sendObject(info);
	}
	
	@Path(start="analyzeURL")
	public void analyzeURL(Request request) throws IOException {
		String url = request.getString("url");
		InternetAddressInfo info = new InternetAddressInfo();
		HTMLDocument doc = new HTMLDocument(url);
		info.setName(doc.getTitle());
		info.setAddress(url);
		info.setDescription(StringUtils.abbreviate(doc.getText(), 500));
		request.sendObject(info);
	}
	
	@Path(start="saveInternetAddress")
	public void saveInternetAddress(Request request) throws ModelException, SecurityException, InterruptedException {
		InternetAddressInfo info = request.getObject("info", InternetAddressInfo.class);
		InternetAddress address;
		if (info.getId()!=null) {
			address = modelService.get(InternetAddress.class, info.getId(), request.getSession());
		} else {
			address = new InternetAddress();
		}
		address.setAddress(info.getAddress());
		address.setName(info.getName());
		address.overrideFirstProperty(Property.KEY_COMMON_DESCRIPTION, info.getDescription());
		address.overrideProperties(Property.KEY_COMMON_TAG, info.getTags());
		modelService.createOrUpdateItem(address, request.getSession());
	}
	
	@Path(start="getWidget")
	public void getWidget(Request request) throws ModelException, IOException {
		Entity entity = modelService.get(Entity.class, request.getLong("id"), request.getSession());
		request.sendObject(new WidgetPerspective(entity));
	}
	

	@Path(start="complete")
	public void complete(Request request) throws IOException {
		String text = request.getString("text");
		Query<InternetAddress> query = new Query<InternetAddress>(InternetAddress.class).withPrivileged(request.getSession()).withWords(text);
		query.withPaging(0, 30);
		SearchResult<InternetAddress> result = modelService.search(query);
		
		List<InternetAddress> addresses = result.getList();
		List<KeyboardNavigatorItem> items = Lists.newArrayList();
		for (InternetAddress address : addresses) {
			KeyboardNavigatorItem item = new KeyboardNavigatorItem();
			item.setText(address.getName());
			item.setData(address);
			items.add(item);
		}
		request.sendObject(items);
	}
	
	public void setImportService(ImportService importService) {
		this.importService = importService;
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}
	
	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}
}
