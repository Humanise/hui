package dk.in2isoft.onlineobjects.apps.setup;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.apache.lucene.document.Document;
import org.joda.time.Period;
import org.joda.time.format.PeriodFormatter;
import org.joda.time.format.PeriodFormatterBuilder;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.commons.lang.Mapper;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListWriter;
import dk.in2isoft.onlineobjects.apps.setup.perspectives.InternetAddressPerspective;
import dk.in2isoft.onlineobjects.apps.setup.perspectives.SchedulerStatusPerspective;
import dk.in2isoft.onlineobjects.apps.setup.perspectives.UserPerspective;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Privileged;
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
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.annotations.Appearance;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.onlinepublisher.PublisherPerspective;
import dk.in2isoft.onlineobjects.modules.scheduling.JobInfo;
import dk.in2isoft.onlineobjects.modules.surveillance.LogEntry;
import dk.in2isoft.onlineobjects.modules.surveillance.RequestInfo;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.Dates;
import dk.in2isoft.onlineobjects.util.Messages;

public class SetupController extends SetupControllerBase {
	
	@Override
	public void unknownRequest(Request request) throws IOException,EndUserException {
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
	
	@Path
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
	
	@Path
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
		if (securityService.canChangeUsername(user)) {
			user.setUsername(perspective.getUsername());			
		}
		user.setName(perspective.getName());
		modelService.updateItem(user, request.getSession());
		
		securityService.grantPublicPrivileges(user, perspective.isPublicView(), perspective.isPublicModify(), perspective.isPublicDelete());
	}
	
	@Path
	public void listJobLog(Request request) throws IOException {
		ListWriter writer = new ListWriter(request);
		writer.startList();
		writer.startHeaders();
		writer.header("Time",10).header("Text").header("Name").header("Group");
		writer.endHeaders();
		List<LogEntry> liveLog = schedulingService.getLiveLog();
		for (LogEntry entry : liveLog) {
			writer.startRow();
			writer.startCell().text(Dates.formatTime(entry.getDate(), request.getLocale())).endCell();
			writer.startCell().text(entry.getTitle()).endCell();
			writer.startCell().text(entry.getName()).endCell();
			writer.startCell().text(entry.getGroup()).endCell();
			writer.endRow();
		}
		writer.endList();
	}
	
	@Path
	public void listJobs(Request request) throws SecurityException, IOException {
		Messages msg = new Messages(this);
		Locale locale = request.getLocale();
		PeriodFormatter pf = new PeriodFormatterBuilder().appendHours().appendSeparator(":").appendMinutes().appendSeparator(":").appendSeconds().toFormatter();
		boolean active = schedulingService.isRunning();
		
		ListWriter writer = new ListWriter(request);
		writer.startList();
		writer.startHeaders();
		writer.header("Name",10).header("Group",10).header("Status",15).header("",10).header("Timing",10).header("Latest",10).header("Next",10).header("State").header("", 1);
		writer.endHeaders();
		long now = System.currentTimeMillis();
		List<JobInfo> jobList = schedulingService.getJobList();
		for (JobInfo status : jobList) {
			Map<String,Object> data = Mapper.<String,Object>build("group", status.getGroup()).add("name", status.getName()).add("status", status.getTriggerState()).add("running", new Boolean(status.isRunning())).get();
			boolean paused = "PAUSED".equals(status.getTriggerState());
			
			writer.startRow().withId(status.getGroup()+"-"+status.getName()).withData(data);
			writer.startCell();
			if (status.isRunning()) {
				writer.withIcon("status/running");
			} else {
				if (paused) {
					writer.withIcon("status/paused");
				} else {
					writer.withIcon("status/waiting");
				}
			}
			writer.text(status.getName()).endCell();
			writer.startCell().text(status.getGroup()).endCell();
			writer.startCell();
			if (status.isRunning()) {
				writer.text(pf.print(new Period(status.getCurrentRunTime()).toPeriod()));
			} else {
				if (paused) {
					writer.text("Paused");
				} else if (status.getNextRun()!=null && active) {
					writer.text(pf.print(new Period(status.getNextRun().getTime()-now)));
				} else {
					writer.text(msg.get("job_waiting",locale));
				}
			}
			writer.endCell();
			writer.startCell();
			if (status.isRunning()) {
				writer.progress(status.getProgress());
			}
			writer.endCell();
			writer.startCell().text(status.getTriggerTiming()).endCell();
			writer.startCell().text(Dates.formatTime(status.getLatestRun(), locale)).endCell();
			writer.startCell().text(Dates.formatTime(status.getNextRun(), locale)).endCell();
			writer.startCell().text(status.getTriggerState()).endCell();
			writer.startCell();
			if (!"BLOCKED".equals(status.getTriggerState())) {
				writer.startIcons().startActionIcon("monochrome/play").withData("play").endIcon().endIcons();
			}
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}

	@Path
	public void startJob(Request request) throws SecurityException, IOException {
		schedulingService.runJob(request.getString("name"), request.getString("group"));
	}

	@Path
	public void stopJob(Request request) throws SecurityException, IOException {
		schedulingService.stopJob(request.getString("name"), request.getString("group"));
	}

	@Path
	public void pauseJob(Request request) throws SecurityException, IOException {
		schedulingService.pauseJob(request.getString("name"), request.getString("group"));
	}
	
	@Path
	public void resumeJob(Request request) throws SecurityException, IOException {
		schedulingService.resumeJob(request.getString("name"), request.getString("group"));
	}

	@Path
	public void toggleScheduler(Request request) throws SecurityException, IOException {
		if (request.isSet("active")) {
			schedulingService.setActive(request.getBoolean("active"));
		} else {
			schedulingService.toggle();
		}
	}

	@Path
	public SchedulerStatusPerspective getSchedulerStatus(Request request) {
		SchedulerStatusPerspective status = new SchedulerStatusPerspective();
		status.setRunning(schedulingService.isRunning());
		return status;
	}
	
	@Path
	public void getSurveillanceList(Request request) throws IOException {
		String kind = request.getString("kind");
		if ("longestRunningRequests".equals(kind)) {
			ListData data = new ListData();
			List<RequestInfo> requests = surveillanceService.getLongestRunningRequests();
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
			request.sendObject(data);
		} else if ("log".equals(kind)) {
			ListWriter writer = new ListWriter(request);
			
			writer.startList();
			
			writer.startHeaders().header("Time").header("Title").header("Details").endHeaders();
			
			Locale locale = request.getLocale();
			List<dk.in2isoft.onlineobjects.modules.surveillance.LogEntry> entries = surveillanceService.getLogEntries();
			Collections.reverse(entries);
			for (dk.in2isoft.onlineobjects.modules.surveillance.LogEntry entry : entries) {
				writer.startRow();
				writer.startCell().text(Dates.formatTime(entry.getDate(), locale)).endCell();
				writer.startCell().text(entry.getTitle()).endCell();
				writer.startCell().text(entry.getDetails()).endCell();
				writer.endRow();
			}
			writer.endList();
			
		} else {
			ListData data = new ListData();
			Collection<String> exceptions = surveillanceService.getLatestExceptions();
			List<String> reversed = Lists.newArrayList(exceptions);
			Collections.reverse(reversed);
			data.addHeader("Exception");
			for (String string : reversed) {
				data.newRow();
				data.addCell(string);
			}
			request.sendObject(data);
		}
	}
	
	@Path
	public void changeAdminPassword(Request request) throws EndUserException {
		throw new IllegalRequestException("This is deprecated!");
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

	@Path
	public void listPublishers(Request request) throws ModelException, IOException {
		
		List<InternetAddress> sites = onlinePublisherService.getSites(request.getSession());
		
		ListWriter writer = new ListWriter(request);
		writer.startList();
		writer.startHeaders().header("Name").header("Address").endHeaders();
		for (InternetAddress address : sites) {
			writer.startRow().withId(address.getId());
			writer.startCell().withIcon(address.getIcon()).text(address.getName()).endCell();
			writer.startCell().text(address.getAddress()).endCell();
			writer.endRow();
		}
		writer.endList();
	}
	
	@Path
	public void savePublisher(Request request) throws IOException,EndUserException {
		PublisherPerspective perspective = request.getObject("publisher", PublisherPerspective.class);
		Privileged privileged = request.getSession();
		onlinePublisherService.createOrUpdatePublisher(perspective, privileged);
	}

	@Path
	public PublisherPerspective loadPublisher(Request request) throws IOException,EndUserException {
		return onlinePublisherService.getPublisherPerspective(request.getLong("id"), request.getSession());
	}

	@Path
	public void deletePublisher(Request request) throws IOException,EndUserException {
		onlinePublisherService.deletePublisher(request.getLong("id"), request.getSession());
	}

	@Path
	public void listInternetAddresses(Request request) throws ModelException, IOException {
		int page = request.getInt("page");
		int size = 50;
		
		SearchResult<InternetAddress> result = modelService.search(Query.after(InternetAddress.class).withPaging(page, 50));
		
		ListWriter writer = new ListWriter(request);
		writer.startList();
		writer.window(result.getTotalCount(), size, page);
		writer.startHeaders().header("Name",40).header("Address").endHeaders();
		for (InternetAddress address : result.getList()) {
			writer.startRow().withId(address.getId());
			writer.startCell().withIcon(address.getIcon()).text(address.getName()).endCell();
			writer.startCell().startWrap().text(address.getAddress()).endWrap().endCell();
			writer.endRow();
		}
		writer.endList();
	}

	@Path
	public InternetAddressPerspective getInternetAddressesInfo(Request request) throws IOException,EndUserException {
		Long id = request.getLong("id");
		InternetAddressPerspective perspective = new InternetAddressPerspective();
		InternetAddress address = modelService.get(InternetAddress.class, id, request.getSession());
		if (address==null) {
			throw new ContentNotFoundException("The address could not be found, id = "+id);
		}
		String content = address.getPropertyValue(Property.KEY_INTERNETADDRESS_CONTENT);
		perspective.setContent(content);
		perspective.setId(address.getId());
		perspective.setTitle(address.getName());
		perspective.setRendering(buildRendering(address,content));
		return perspective;
	}
	
	private String buildRendering(InternetAddress address, String content) {
		HTMLWriter html = new HTMLWriter();
		
		html.startH1().text(address.getName()).endH1();
		html.startP().startA().withHref(address.getAddress()).text(address.getAddress()).endA().endP();
		if (Strings.isNotBlank(content)) {
			String[] lines = StringUtils.split(content, "\n");
			html.startDiv().withClass("body");
			for (int i = 0; i < lines.length; i++) {
				html.startP().text(lines[i]).endP();
			}
			html.endDiv();
		} else {
			html.startP().text("No content").endP();
		}
		return html.toString();
	}
	
	@Path
	public List<ItemData> getIndexOptions(Request request) {
		List<ItemData> options = Lists.newArrayList();
		List<String> names = indexService.getIndexNames();
		for (String name : names) {
			ItemData item = new ItemData();
			item.setTitle(name);
			item.setValue(name);
			options.add(item);
		}
		
		return options;
	}

	@Path
	public void getIndexDocuments(Request request) throws IOException, EndUserException {
		String name = request.getString("name", "No name provided");
		int page = request.getInt("page");
		int count = request.getInt("count");
		count = 30;
		IndexManager manager = indexService.getIndex(name);
		if (manager==null) {
			throw new IllegalRequestException("No index manager width the name '"+name+"'");
		}

		ListWriter writer = new ListWriter(request);
		SearchResult<Document> result = manager.getDocuments(page,count);
		List<Document> list = result.getList();
		writer.startList();
		writer.window(result.getTotalCount(), count, page);
		writer.startHeaders();
		writer.header("ID", 30);
		writer.header("Word");
		writer.header("Text");
		writer.endHeaders();
		for (Document document : list) {
			writer.startRow().cell(document.get("id")).cell(document.get("word")).cell(document.get("text"));
			writer.endRow();			
		}
		writer.endList();
	}
	
	@Path
	public void getIndexStatistics(Request request) throws IOException, EndUserException {
		String name = request.getString("name", "No name provided");
		IndexManager manager = indexService.getIndex(name);
		if (manager==null) {
			throw new IllegalRequestException("No index manager width the name '"+name+"'");
		}
		ListWriter writer = new ListWriter(request);
		writer.startList();
		writer.startHeaders();
		writer.header("Property", 30);
		writer.header("Value");
		writer.endHeaders();
		writer.startRow().cell("Count").cell(manager.getDocumentCount()).endRow();
		writer.endList();
	}
	
	@Path
	public void createMember(Request request) throws IOException, EndUserException {
		UserSession session = request.getSession();
		String username = request.getString("username", "No username");
		String password = request.getString("password", "No password");
		String fullName = request.getString("name", "No full name");
		String email = request.getString("email", "No e-mail");
		memberService.createMember(session, username, password, fullName, email);
	}
}
