package dk.in2isoft.onlineobjects.apps.setup;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;

import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.ListObjects;
import dk.in2isoft.in2igui.data.ListState;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.SchedulingService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class SetupRemotingFacade extends AbstractRemotingFacade {
	
	private ImageService imageService;
	private FileService fileService;
	private SchedulingService schedulingService;

	private void checkUser() throws SecurityException {
		String username = getUserSession().getUser().getUsername();
		if (!SecurityService.ADMIN_USERNAME.equals(username)) {
			throw new SecurityException("This tool can only be accessed by the administrator");
		}
	}
	
	public void changeAdminPassword(String password1, String password2) throws EndUserException {
		checkUser();
		if (StringUtils.isBlank(password1) || StringUtils.isBlank(password2)) {
			throw new EndUserException("The password cannot be blank");
		}
		if (!password1.equals(password2)) {
			throw new EndUserException("The passwords do not match");
		}
		User user = modelService.getUser(SecurityService.ADMIN_USERNAME);
		user.setPassword(password1);
		modelService.updateItem(user, getUserSession());
	}
	
	public ListObjects listJobs() throws SecurityException {
		checkUser();
		ListObjects list = new ListObjects();
		Map<String, String> jobs = schedulingService.listJobs();
		for (Entry<String,String> entry : jobs.entrySet()) {
			String name = entry.getKey();
			String group = entry.getValue();
			ListDataRow row = new ListDataRow();
			row.addColumn("name", name);
			row.addColumn("group", group);
			boolean running = schedulingService.isRunning(name, group);
			row.addColumn("status", running ? "Kører" : "Venter");
			list.add(row);
		}
		return list;
	}
	
	public ListData listEntities(ListState state,String clazz,String search) throws SecurityException, ClassNotFoundException {
		checkUser();
		int page = state!=null ? state.getPage() : 0;
		ListData list = new ListData();
		list.addHeader("Name");
		list.addHeader("Type");
		Class<Entity> className;
		if (clazz==null) {
			className = Entity.class;
		} else {
			className = (Class<Entity>) Class.forName(clazz);
		}
		Query<Entity> query = (Query<Entity>) Query.of(className).withWords(search).withPaging(page, 50);
		SearchResult<Entity> result = modelService.search(query);
		list.setWindow(result.getTotalCount(), 50, page);
		for (Entity entity : result.getList()) {
			String kind = entity.getClass().getSimpleName().toLowerCase();
			list.newRow(entity.getId(),kind);
			list.addCell(entity.getName(), entity.getIcon());
			list.addCell(entity.getType());
		}
		return list;
	}

	public List<Image> listImages(String text,String tag) throws EndUserException {
		Query<Image> query = new Query<Image>(Image.class).withPaging(0, 50);
		query.withWords(text);
		if (tag!=null) {
			query.withCustomProperty(Property.KEY_COMMON_TAG, tag);
		}
		return modelService.list(query);
	}

	public List<ItemData> getImageTags(String text) throws EndUserException {
		Map<String, Integer> properties = modelService.getProperties(Property.KEY_COMMON_TAG, Image.class, null);
		List<ItemData> items = Lists.newArrayList();
		for (Entry<String, Integer> itemData : properties.entrySet()) {
			ItemData data = new ItemData();
			data.setValue(itemData.getKey());
			data.setTitle(itemData.getKey());
			data.setBadge(itemData.getValue().toString());
			data.setIcon("common/folder");
			items.add(data);
		}
		return items;
	}
	
	public void startJob(String name, String group) throws SecurityException {
		checkUser();
		schedulingService.runJob(name, group);
	}
	
	public void updateUser(long id,String username,String password) throws EndUserException {
		checkUser();
		User user = modelService.get(User.class, id);
		user.setPassword(password);
		user.setUsername(username);
		modelService.updateItem(user, getUserSession());
	}
	
	public void deleteUser(long id) throws EndUserException {
		checkUser();
		User user = modelService.get(User.class, id);
		List<Entity> list = modelService.list(Query.of(Entity.class).withPriviledged(user));
		for (Entity entity : list) {
			modelService.deleteEntity(entity, getUserSession());
		}
		modelService.deleteEntity(user, getUserSession());
	}
	
	public void synchronizeImageMetaData() throws EndUserException {
		checkUser();
		UserSession userSession = getUserSession();
		List<Image> list = modelService.list(Query.of(Image.class));
		for (Image image : list) {
			String name = image.getName();
			if (name!=null && name.toLowerCase().endsWith(".jpg")) {
				image.setName(fileService.cleanFileName(name));
				modelService.updateItem(image, userSession);
			}
			imageService.synchronizeContentType(image, userSession);
			imageService.synchronizeMetaData(image,userSession);
		}
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public ImageService getImageService() {
		return imageService;
	}

	public void setSchedulingService(SchedulingService schedulingService) {
		this.schedulingService = schedulingService;
	}

	public SchedulingService getSchedulingService() {
		return schedulingService;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}
}
