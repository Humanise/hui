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

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.ListObjects;
import dk.in2isoft.in2igui.data.ListState;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Application;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.localization.LocalizationService;
import dk.in2isoft.onlineobjects.modules.scheduling.SchedulingService;
import dk.in2isoft.onlineobjects.modules.surveillance.RequestInfo;
import dk.in2isoft.onlineobjects.services.FileService;
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
			className = Code.<Entity>castClass(Class.forName(clazz));
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
	
	public ListData listUsers(ListState state,String search) throws SecurityException, ClassNotFoundException, ModelException {
		User publicUser = securityService.getPublicUser();
		int page = state!=null ? state.getPage() : 0;
		ListData list = new ListData();
		list.addHeader("Name");
		list.addHeader("Username");
		list.addHeader("Person");
		list.addHeader("E-mail");
		list.addHeader("Image");
		list.addHeader("Images");
		list.addHeader("Public view");
		list.addHeader("Public modify");
		list.addHeader("Public delete");
		Query<User> query = Query.of(User.class).withWords(search).withPaging(page, 50);
		SearchResult<User> result = modelService.search(query);
		list.setWindow(result.getTotalCount(), 50, page);
		for (User user : result.getList()) {
			Query<Image> imgQuery = Query.after(Image.class).withPrivileged(user);
			Long imageCount = modelService.count(imgQuery);
			Image image = modelService.getChild(user, Image.class);
			Person person = modelService.getChild(user, Person.class);
			EmailAddress email = null;
			if (person!=null) {
				email = modelService.getChild(person, EmailAddress.class);
			}
			String kind = user.getClass().getSimpleName().toLowerCase();
			list.newRow(user.getId(),kind);
			list.addCell(user.getName(), user.getIcon());
			list.addCell(user.getUsername());
			list.addCell(person==null ? "?" : person.getFullName());
			list.addCell(email==null ? "?" : email.getAddress());
			list.addCell(image==null ? "?" : StringUtils.abbreviate(image.getName(), 30));
			list.addCell(imageCount);
			list.addCell(securityService.canView(user, publicUser));
			list.addCell(securityService.canModify(user, publicUser));
			list.addCell(securityService.canDelete(user, publicUser));
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
		Entity entity = modelService.get(Entity.class, info.getId(), getRequest().getSession());
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
		User user = modelService.get(User.class, id, getRequest().getSession());
		user.setPassword(password);
		user.setUsername(username);
		modelService.updateItem(user, getUserSession());
	}
	
	public void deleteUser(long id) throws EndUserException {
		User user = modelService.get(User.class, id, getRequest().getSession());
		List<Entity> list = modelService.list(Query.of(Entity.class).withPrivileged(user));
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
	
	public ListData getApplicationList() {
		ListData data = new ListData();
		List<Application> list = modelService.list(Query.of(Application.class).orderByName());
		data.addHeader("Name");
		data.addHeader("Domain");
		for (Application application : list) {
			data.newRow(application.getId(),"application");
			data.addCell(application.getName());
			data.addCell(application.getPropertyValue("domain"));
		}
		return data;
	}
	
	public ApplicationInfo getApplication(long id) throws ModelException {
		Application application = modelService.get(Application.class, id,getRequest().getSession().getUser());
		ApplicationInfo info = new ApplicationInfo();
		info.setName(application.getName());
		info.setId(application.getId());
		info.setDomain(application.getPropertyValue("domain"));
		return info;
	}
	
	public void deleteApplication(long id) throws ModelException, SecurityException {
		Application application = modelService.get(Application.class, id,getRequest().getSession().getUser());
		modelService.deleteEntity(application, getUserSession());
	}
	
	public void saveApplication(ApplicationInfo info) throws ModelException, SecurityException {
		if (info.getId()==null || info.getId()==0) {
			Application application = new Application();
			application.setName(info.getName());
			application.overrideFirstProperty("domain", info.getDomain());
			modelService.createItem(application, getUserSession());
		} else {
			Application application = modelService.get(Application.class, info.getId(), getRequest().getSession());
			application.setName(info.getName());
			application.overrideFirstProperty("domain", info.getDomain());
			modelService.updateItem(application, getUserSession());
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
