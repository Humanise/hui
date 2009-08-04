package dk.in2isoft.onlineobjects.apps.setup;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;

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
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.SchedulingService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class SetupRemotingFacade extends AbstractRemotingFacade {
	
	private ImageService imageService;
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
	
	public ListObjects listEntities(Map<String,Object> state,String clazz,String search) throws SecurityException {
		checkUser();
		ListObjects list = new ListObjects();
		Class<Entity> className = Entity.class;
		try {
			className = (Class<Entity>) Class.forName(clazz);
		} catch (Exception e) {
			return list;
		}
		Query<Entity> query = (Query<Entity>) Query.of(className).withWords(search).withPaging(0, 50);
		List<Entity> data = modelService.list(query);
		for (Entity entity : data) {
			ListDataRow row = new ListDataRow();
			row.addColumn("id", entity.getId());
			row.addColumn("icon", entity.getIcon());
			row.addColumn("name", entity.getName());
			row.addColumn("type", entity.getType());
			row.addColumn("kind", entity.getClass().getSimpleName().toLowerCase());
			list.add(row);
		}
		return list;
	}
	
	public ListData listEntities2(ListState state,String clazz,String search) throws SecurityException {
		checkUser();
		int page = state!=null ? state.getPage() : 0;
		ListData list = new ListData();
		list.addHeader("Name");
		list.addHeader("Type");
		Class<Entity> className = Entity.class;
		try {
			className = (Class<Entity>) Class.forName(clazz);
		} catch (Exception e) {
			return list;
		}
		Query<Entity> query = (Query<Entity>) Query.of(className).withWords(search).withPaging(page, 50);
		SearchResult<Entity> result = modelService.search(query);
		list.setWindow(result.getTotalCount(), 50, page);
		for (Entity entity : result.getResult()) {
			String kind = entity.getClass().getSimpleName().toLowerCase();
			list.newRow(entity.getId(),kind);
			list.addCell(entity.getName(), entity.getIcon());
			list.addCell(entity.getType());
		}
		return list;
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
				image.setName(getImageService().cleanFileName(name));
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
}
