package dk.in2isoft.onlineobjects.apps.setup;

import java.lang.reflect.Method;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;

import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.ListObjects;
import dk.in2isoft.in2igui.data.ListState;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.localization.LocalizationService;
import dk.in2isoft.onlineobjects.modules.surveillance.RequestInfo;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.SchedulingService;
import dk.in2isoft.onlineobjects.services.SurveillanceService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class SetupRemotingFacade extends AbstractRemotingFacade {
	
	private ImageService imageService;
	private FileService fileService;
	private SchedulingService schedulingService;
	private SecurityService securityService;
	private SurveillanceService surveillanceService;
	private LocalizationService localizationService;
	
	@Override
	public boolean isAccessAllowed(Method method) throws SecurityException {
		String username = getUserSession().getUser().getUsername();
		if (!SecurityService.ADMIN_USERNAME.equals(username)) {
			throw new SecurityException("This tool can only be accessed by the administrator");
		}
		return true;
	}
	
	public void changeAdminPassword(String password1, String password2) throws EndUserException {
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
			Date latest = schedulingService.getLatestExecution(name, group);
			row.addColumn("latest", String.valueOf(latest));
			Date next = schedulingService.getNextExecution(name, group);
			row.addColumn("next", String.valueOf(next));
			list.add(row);
		}
		return list;
	}
	
	public ListData listEntities(ListState state,String clazz,String search) throws SecurityException, ClassNotFoundException {
		User publicUser = securityService.getPublicUser();
		int page = state!=null ? state.getPage() : 0;
		ListData list = new ListData();
		list.addHeader("Name");
		list.addHeader("Type");
		list.addHeader("Public view");
		list.addHeader("Public modify");
		list.addHeader("Public delete");
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
			list.addCell(securityService.canView(entity, publicUser));
			list.addCell(securityService.canModify(entity, publicUser));
			list.addCell(securityService.canDelete(entity, publicUser));
		}
		return list;
	}
	
	public EntityInfo getEntityInfo(long id) {
		EntityInfo info = new EntityInfo();
		info.setId(id);
		Privilege privilege = securityService.getPrivilege(id,securityService.getPublicUser());
		if (privilege!=null) {
			info.setPublicAlter(privilege.isAlter());
			info.setPublicDelete(privilege.isDelete());
			info.setPublicView(privilege.isView());
		}
		return info;
	}
	
	public void updateEntityInfo(EntityInfo info) throws ModelException {
		Entity entity = modelService.get(Entity.class, info.getId());
		securityService.grantPublicPrivileges(entity,info.isPublicView(),info.isPublicAlter(),info.isPublicDelete());
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
		schedulingService.runJob(name, group);
	}
	
	public void updateUser(long id,String username,String password) throws EndUserException {
		User user = modelService.get(User.class, id);
		user.setPassword(password);
		user.setUsername(username);
		modelService.updateItem(user, getUserSession());
	}
	
	public void deleteUser(long id) throws EndUserException {
		User user = modelService.get(User.class, id);
		List<Entity> list = modelService.list(Query.of(Entity.class).withPriviledged(user));
		for (Entity entity : list) {
			modelService.deleteEntity(entity, getUserSession());
		}
		modelService.deleteEntity(user, getUserSession());
	}
	
	public void synchronizeImageMetaData() throws EndUserException {
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
	
	public ListData getSurveillanceList(String kind) {
		ListData data = new ListData();
		if ("longestRunningRequests".equals(kind)) {
			SortedSet<RequestInfo> requests = surveillanceService.getLongestRunningRequests();
			data.addHeader("URI");
			data.addHeader("Hits");
			data.addHeader("Average");
			data.addHeader("Max");
			data.addHeader("Min");
			data.addHeader("Total");
			
			for (RequestInfo info : requests) {
				data.newRow();
				data.addCell(info.getUri());
				data.addCell(String.valueOf(info.getCounts()));
				data.addCell(String.valueOf(info.getAverageRunningTime()));
				data.addCell(String.valueOf(info.getMaxRunningTime()));
				data.addCell(String.valueOf(info.getMinRunningTime()));
				data.addCell(localizationService.formatMilis(info.getTotalRunningTime()));
			}
		} else {
			Collection<String> exceptions = surveillanceService.getLatestExceptions();
			List<String> reversed = Lists.newArrayList(exceptions);
			Collections.reverse(reversed);
			data.addHeader("Exception");
			for (String string : reversed) {
				data.newRow();
				data.addCell(string);
			}
		}
		return data;
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public void setSchedulingService(SchedulingService schedulingService) {
		this.schedulingService = schedulingService;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public void setSurveillanceService(SurveillanceService surveillanceService) {
		this.surveillanceService = surveillanceService;
	}
	
	public void setLocalizationService(LocalizationService localizationService) {
		this.localizationService = localizationService;
	}
}
