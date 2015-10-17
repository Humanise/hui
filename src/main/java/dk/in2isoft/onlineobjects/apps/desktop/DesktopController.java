package dk.in2isoft.onlineobjects.apps.desktop;

import java.io.IOException;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.in2igui.data.KeyboardNavigatorItem;
import dk.in2isoft.onlineobjects.apps.community.remoting.InternetAddressInfo;
import dk.in2isoft.onlineobjects.apps.desktop.importing.GenericImportListener;
import dk.in2isoft.onlineobjects.apps.desktop.model.WidgetList;
import dk.in2isoft.onlineobjects.apps.desktop.model.WidgetListItem;
import dk.in2isoft.onlineobjects.apps.desktop.perspectives.ImportPerspective;
import dk.in2isoft.onlineobjects.apps.desktop.perspectives.UserInfoPerspective;
import dk.in2isoft.onlineobjects.apps.desktop.perspectives.WidgetPerspective;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.modules.importing.HttpImportTransport;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;
import dk.in2isoft.onlineobjects.modules.importing.UploadImportTransport;
import dk.in2isoft.onlineobjects.ui.Request;

public class DesktopController extends DesktopControlerBase {

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
	
	@Path
	public void getUserInfo(Request request) throws IOException, EndUserException {
		if (request.isUser(SecurityService.PUBLIC_USERNAME)) {
			throw new SecurityException("This user does not have access");
		}
		UserInfoPerspective info = new UserInfoPerspective();
		info.setUsername(request.getSession().getUser().getUsername());
		request.sendObject(info);
	}
	
	@Path
	public void importUrl(Request request) throws IOException {
		final String url = request.getString("url");
		GenericImportListener listener = new GenericImportListener();
		listener.setPrivileged(request.getSession());
		listener.setImageService(imageService);
		listener.setHtmlService(htmlService);

		ImportSession session = importService.createImportSession(request.getSession());
		
		HttpImportTransport<Entity> handler = new HttpImportTransport<Entity>(url,listener);
		session.setTransport(handler);
		session.startInBackground();
		System.out.println("Start: "+session.getId()+" / "+session.getStatus());
		ImportPerspective info = new ImportPerspective(session);
		request.sendObject(info);
		System.out.println("Request finished");
	}

	@Path
	public void uploadFile(Request request) throws IOException, EndUserException {
		GenericImportListener listener = new GenericImportListener();
		listener.setPrivileged(request.getSession());
		listener.setImageService(imageService);

		ImportSession session = importService.createImportSession(request.getSession());
		
		UploadImportTransport<Entity> transport = new UploadImportTransport<Entity>();		
		transport.setImportListener(listener);
		transport.setRequest(request);
		
		session.setTransport(transport);
		session.start();
				
		ImportPerspective info = new ImportPerspective(session);
		request.sendObject(info);
	}

	@Path
	public void getImport(Request request) throws IOException {
		ImportSession session = importService.getImportSession(request.getString("id"));
		//System.out.println("Check: "+session.getId()+" / "+session.getStatus());
		ImportPerspective info = new ImportPerspective(session);
		
		request.sendObject(info);
	}
	
	@Path
	public void analyzeURL(Request request) throws IOException {
		String url = request.getString("url");
		InternetAddressInfo info = new InternetAddressInfo();
		HTMLDocument doc = htmlService.getDocumentSilently(url);
		info.setName(doc.getTitle());
		info.setAddress(url);
		info.setDescription(StringUtils.abbreviate(doc.getText(), 500));
		request.sendObject(info);
	}
	
	@Path
	public void saveInternetAddress(Request request) throws ModelException, SecurityException, InterruptedException, IllegalRequestException {
		InternetAddressInfo info = request.getObject("info", InternetAddressInfo.class);
		if (info==null) {
			throw new IllegalRequestException("Illegal format");			
		}
		InternetAddress address;
		if (info.getId()!=null) {
			address = modelService.get(InternetAddress.class, info.getId(), request.getSession());
			if (address==null) {
				throw new IllegalRequestException("Not found");
			}
		} else {
			address = new InternetAddress();
		}
		address.setAddress(info.getAddress());
		address.setName(info.getName());
		address.overrideFirstProperty(Property.KEY_COMMON_DESCRIPTION, info.getDescription());
		address.overrideProperties(Property.KEY_COMMON_TAG, info.getTags());
		modelService.createOrUpdateItem(address, request.getSession());
	}
	
	@Path
	public void getWidget(Request request) throws ModelException, IOException {
		Entity entity = modelService.get(Entity.class, request.getLong("id"), request.getSession());
		request.sendObject(new WidgetPerspective(entity));
	}
	
	@Path
	public WidgetList listBookmarks(Request request) throws IOException {
		String text = request.getString("text");
		Query<InternetAddress> query = new Query<InternetAddress>(InternetAddress.class).withPrivileged(request.getSession()).withWords(text);
		query.withPaging(0, 30);
		List<InternetAddress> result = modelService.search(query).getList();
		
		WidgetList list = new WidgetList();
		for (InternetAddress address : result) {
			WidgetListItem item = new WidgetListItem();
			item.setText(address.getName());
			list.addItem(item);
		}
		return list;
	}
	

	@Path
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
}
