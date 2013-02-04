package dk.in2isoft.onlineobjects.apps.setup;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.SortedSet;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListWriter;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.setup.perspectives.UserPerspective;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.annotations.Appearance;
import dk.in2isoft.onlineobjects.modules.localization.LocalizationService;
import dk.in2isoft.onlineobjects.modules.scheduling.SchedulingService;
import dk.in2isoft.onlineobjects.modules.surveillance.RequestInfo;
import dk.in2isoft.onlineobjects.services.SurveillanceService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.Dates;
import dk.in2isoft.onlineobjects.util.ValidationUtil;

public class SetupController extends ApplicationController {

	private SecurityService securityService;
	private SchedulingService schedulingService;
	private SurveillanceService surveillanceService;
	private LocalizationService localizationService;
	
	public SetupController() {
		super("setup");
	}
	
	@Override
	public boolean isAllowed(Request request) {
		return request.isUser(SecurityService.ADMIN_USERNAME);
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		if (!request.isUser(SecurityService.ADMIN_USERNAME)) {
			request.redirectFromBase("/service/authentication/?redirect=/app/setup/&action=appAccessDenied&faultyuser="+request.getSession().getUser().getUsername());
		} else {
			String path = request.getLocalPathAsString();
			if (path.endsWith("gui") || path.endsWith("/")) {
				showGui(request);
			} else {
				super.unknownRequest(request);
			}
		}
	}
	
	@Path(start="listUsers")
	public void listUsers(Request request) throws IOException,EndUserException {
		User publicUser = securityService.getPublicUser();
		int page = request.getInt("page");
		Query<User> query = Query.of(User.class).withWords(request.getString("search")).withPaging(page, 10);
		SearchResult<User> result = modelService.search(query);

		ListWriter writer = new ListWriter(request);
		
		writer.startList();
		writer.window(result.getTotalCount(), 10, page);
		writer.startHeaders();
		writer.header("Name");
		writer.header("Username");
		writer.header("Person");
		writer.header("E-mail");
		writer.header("Image");
		writer.header("Images");
		writer.header("Public permissions",1);
		writer.endHeaders();
		for (User user : result.getList()) {
			Query<Image> imgQuery = Query.after(Image.class).withPrivileged(user);
			Long imageCount = modelService.count(imgQuery);
			Image image = modelService.getChild(user, Image.class);
			Person person = modelService.getChild(user, Person.class);
			EmailAddress email = null;
			if (person!=null) {
				email = modelService.getChild(person, EmailAddress.class);
			}
			writer.startRow().withId(user.getId()).withKind("user");
			writer.startCell().withIcon(user.getIcon()).text(user.getName()).endCell();
			writer.startCell().text(user.getUsername()).endCell();
			writer.startCell();
			if (person!=null) {
				writer.withIcon(person.getIcon()).text(person.getFullName());
			}
			writer.endCell();
			writer.startCell();
			if (email!=null) {
				writer.withIcon(email.getIcon());
				writer.text(email.getAddress());
			}
			writer.endCell();
			writer.startCell();
			if (image!=null) {
				writer.withIcon(image.getIcon());
				writer.text(StringUtils.abbreviateMiddle(image.getName(), "...", 20));
			}
			writer.endCell();
			writer.startCell().text(imageCount).endCell();
			writer.startCell();
			if (securityService.canView(user, publicUser)) {
				writer.icon("monochrome/view");
			}
			if (securityService.canModify(user, publicUser)) {
				writer.icon("monochrome/edit");
			}
			if (securityService.canDelete(user, publicUser)) {
				writer.icon("monochrome/delete");
			}
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}
	
	@Path(start="listUsersObjects")
	public void listUsersObjects(Request request) throws IOException,EndUserException {
		long id = request.getLong("userId");
		int page = request.getInt("page");
		
		User publicUser = securityService.getPublicUser();
		User user = modelService.get(User.class, id, request.getSession());
		if (user==null) {
			return;
		}
		Query<Entity> query = Query.of(Entity.class).withPrivileged(user).withPaging(page, 30);
		SearchResult<Entity> result = modelService.search(query);

		ListWriter writer = new ListWriter(request);
		
		writer.startList();
		writer.window(result.getTotalCount(), 30, page);
		writer.startHeaders();
		writer.header("Name",40);
		writer.header("Type");
		writer.header("Private grants",1);
		writer.header("Public grants",1);
		writer.endHeaders();
		for (Entity entity : result.getList()) {
			Privilege privilege = securityService.getPrivilege(entity.getId(), user);
			Privilege publicPrivilege = securityService.getPrivilege(entity.getId(), publicUser);
			writer.startRow();
			writer.startCell().withIcon(entity.getIcon()).text(entity.getName()).endCell();
			writer.startCell().text(entity.getClass().getSimpleName()).endCell();
			writer.startCell().nowrap();
			if (privilege.isView()) {
				writer.icon("monochrome/view");
			}
			if (privilege.isAlter()) {
				writer.icon("monochrome/edit");
			}
			if (privilege.isDelete()) {
				writer.icon("monochrome/delete");
			}			
			writer.endCell();
			writer.startCell().nowrap();
			if (publicPrivilege!=null) {
				if (publicPrivilege.isView()) {
					writer.icon("monochrome/view");
				}
				if (publicPrivilege.isAlter()) {
					writer.icon("monochrome/edit");
				}
				if (publicPrivilege.isDelete()) {
					writer.icon("monochrome/delete");
				}
			}
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}
	
	@Path
	public void loadUser(Request request) throws IOException,EndUserException {
		try {Thread.sleep(1000);} catch (InterruptedException e) {}
		Long id = request.getLong("id");
		User user = modelService.get(User.class, id, request.getSession());
		if (user==null) {
			throw new ContentNotFoundException("User not found (id="+id+")");
		}
		User publicUser = securityService.getPublicUser();
		UserPerspective perspective = new UserPerspective();
		perspective.setUsername(user.getUsername());
		perspective.setName(user.getName());
		perspective.setPublicView(securityService.canView(user, publicUser));
		perspective.setPublicModify(securityService.canModify(user, publicUser));
		perspective.setPublicDelete(securityService.canDelete(user, publicUser));
		request.sendObject(perspective);
	}
	
	@Path
	public void deleteUser(Request request) throws ModelException, SecurityException {
		UserSession privileged = request.getSession();
		User user = modelService.get(User.class, request.getLong("id"), privileged);
		List<Entity> list = modelService.list(Query.of(Entity.class).withPrivileged(user));
		for (Entity entity : list) {
			modelService.deleteEntity(entity, privileged);
		}
		modelService.deleteEntity(user, privileged);		
	}
	
	@Path
	public void saveUser(Request request) throws IOException,EndUserException {
		UserPerspective perspective = request.getObject("user", UserPerspective.class);
		if (perspective==null) {
			throw new IllegalRequestException("No user provider");
		}
		User user = modelService.get(User.class, perspective.getId(), request.getSession());
		if (user==null) {
			throw new ContentNotFoundException("User not found (id="+perspective.getId()+")");
		}
		user.setUsername(perspective.getUsername());
		user.setName(perspective.getName());
		modelService.updateItem(user, request.getSession());
		
		securityService.grantPublicPrivileges(user, perspective.isPublicView(), perspective.isPublicModify(), perspective.isPublicDelete());
	}
	
	@Path
	public void listJobs(Request request) throws SecurityException, IOException {
		ListWriter writer = new ListWriter(request);
		writer.startList();
		writer.startHeaders();
		writer.header("Name").header("Group").header("Status").header("Latest").header("Next");
		writer.endHeaders();
		
		Map<String, String> jobs = schedulingService.listJobs();
		for (Entry<String,String> entry : jobs.entrySet()) {
			String name = entry.getKey();
			String group = entry.getValue();
			Date latest = schedulingService.getLatestExecution(name, group);
			Date next = schedulingService.getNextExecution(name, group);
			boolean running = schedulingService.isRunning(name, group);
			
			Map<String,String> data = Maps.newHashMap();
			data.put("group", group);
			data.put("name", name);
			
			writer.startRow().withData(data);
			writer.startCell().text(name).endCell();
			writer.startCell().text(group).endCell();
			writer.startCell().text(running ? "Kører" : "Venter").endCell();
			writer.startCell().text(Dates.formatLongDate(latest, request.getLocale())).endCell();
			writer.startCell().text(Dates.formatLongDate(next, request.getLocale())).endCell();
			writer.endRow();
		}
		writer.endList();
	}

	@Path
	public void startJob(Request request) throws SecurityException, IOException {
		schedulingService.runJob(request.getString("name"), request.getString("group"));
	}
	
	@Path
	public void getSurveillanceList(Request request) throws IOException {
		String kind = request.getString("kind");
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
		request.sendObject(data);
	}
	
	@Path
	public void changeAdminPassword(Request request) throws EndUserException {
		String password = request.getString("password");
		if (!ValidationUtil.isValidPassword(password)) {
			throw new IllegalRequestException("Invalid password");
		}
		securityService.changePassword(SecurityService.ADMIN_USERNAME, password, request.getSession());
	}
	
	@Path
	public ListData listEntities(Request request) throws SecurityException, ClassNotFoundException, IOException {
		User publicUser = securityService.getPublicUser();
		int page = request.getInt("page");
		String clazz = request.getString("type");
		String text = request.getString("text");
		ListData list = new ListData();
		list.addHeader("Name");
		list.addHeader("Type");
		list.addHeader("Public view");
		list.addHeader("Public modify");
		list.addHeader("Public delete");
		Class<Entity> className;
		if (Strings.isBlank(clazz)) {
			className = Entity.class;
		} else {
			className = Code.<Entity>castClass(Class.forName(clazz));
		}
		Query<Entity> query = (Query<Entity>) Query.of(className).withWords(text).withPaging(page, 50);
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
	
	@Path
	public Collection<ItemData> getClasses(Request request) {
		Collection<Class<? extends Entity>> classes = modelService.getEntityClasses();
		Collection<ItemData> items = Lists.newArrayList();
		for (Class<?> clazz : classes) {
			ItemData data = new ItemData();
			data.setValue(clazz.getCanonicalName());
			data.setTitle(clazz.getSimpleName());
			Appearance annotation = clazz.getAnnotation(Appearance.class);
			if (annotation!=null) {
				data.setIcon(annotation.icon());
			} else {
				data.setIcon("monochrome/round_question");
			}
			items.add(data);
		}
		return items;
	}
	
	@Path
	public EntityInfo getEntityInfo(Request request) {
		long id = request.getLong("id");
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
	
	@Path
	public void updateEntityInfo(Request request) throws ModelException {
		EntityInfo info = request.getObject("data", EntityInfo.class);
		Entity entity = modelService.get(Entity.class, info.getId(), request.getSession());
		securityService.grantPublicPrivileges(entity,info.isPublicView(),info.isPublicAlter(),info.isPublicDelete());
	}
	
	@Path
	public List<Image> listImages(Request request) throws EndUserException {
		String text = request.getString("text");
		String tag = request.getString("tag");
		Query<Image> query = new Query<Image>(Image.class).withPaging(0, 50).orderByCreated().descending();
		query.withWords(text);
		if (Strings.isNotBlank(tag)) {
			query.withCustomProperty(Property.KEY_COMMON_TAG, tag);
		}
		return modelService.list(query);
	}

	@Path
	public List<ItemData> getImageTags(Request request) throws EndUserException {
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



	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setSchedulingService(SchedulingService schedulingService) {
		this.schedulingService = schedulingService;
	}
	
	public void setSurveillanceService(SurveillanceService surveillanceService) {
		this.surveillanceService = surveillanceService;
	}
	
	public void setLocalizationService(LocalizationService localizationService) {
		this.localizationService = localizationService;
	}
}
