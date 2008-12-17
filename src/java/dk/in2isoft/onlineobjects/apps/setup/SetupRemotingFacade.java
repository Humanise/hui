package dk.in2isoft.onlineobjects.apps.setup;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.ListObjects;
import dk.in2isoft.in2igui.data.ListState;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.Scheduler;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityController;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class SetupRemotingFacade extends AbstractRemotingFacade {

	private void checkUser() throws SecurityException {
		String username = getUserSession().getUser().getUsername();
		if (!SecurityController.ADMIN_USERNAME.equals(username)) {
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
		User user = getModel().getUser(SecurityController.ADMIN_USERNAME);
		user.setPassword(password1);
		getModel().updateItem(user, getUserSession());
	}
	
	public ListObjects listJobs() throws SecurityException {
		checkUser();
		Scheduler scheduler = Core.getInstance().getScheduler();
		ListObjects list = new ListObjects();
		Map<String, String> jobs = scheduler.listJobs();
		for (Entry<String,String> entry : jobs.entrySet()) {
			String name = entry.getKey();
			String group = entry.getValue();
			ListDataRow row = new ListDataRow();
			row.addColumn("name", name);
			row.addColumn("group", group);
			boolean running = scheduler.isRunning(name, group);
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
		List<Entity> data = getModel().list(query);
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
		SearchResult<Entity> result = getModel().search(query);
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
		Core.getInstance().getScheduler().runJob(name, group);
	}
	
	public void updateUser(long id,String username,String password) throws EndUserException {
		checkUser();
		User user = getModel().get(User.class, id);
		user.setPassword(password);
		user.setUsername(username);
		getModel().updateItem(user, getUserSession());
	}
	
	public void deleteUser(long id) throws EndUserException {
		checkUser();
		ModelFacade model = getModel();
		User user = model.get(User.class, id);
		List<Entity> list = model.list(Query.of(Entity.class).withPriviledged(user));
		for (Entity entity : list) {
			model.deleteEntity(entity, getUserSession());
		}
		getModel().deleteEntity(user, getUserSession());
	}
}
