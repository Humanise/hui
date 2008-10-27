package dk.in2isoft.onlineobjects.apps.setup;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.Scheduler;
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
	
	public ListData listJobs() throws SecurityException {
		checkUser();
		Scheduler scheduler = Core.getInstance().getScheduler();
		ListData list = new ListData();
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
	
	public ListData listEntities(String clazz) throws SecurityException {
		checkUser();
		ListData list = new ListData();
		Class<?> className = Entity.class;
		try {
			className = Class.forName(clazz);
		} catch (ClassNotFoundException e) {
		}
		Query<Entity> query = (Query<Entity>) Query.ofType(className).withPaging(0, 50);
		List<Entity> data = getModel().search(query);
		for (Entity entity : data) {
			ListDataRow row = new ListDataRow();
			row.addColumn("icon", entity.getIcon());
			row.addColumn("name", entity.getName());
			row.addColumn("type", entity.getType());
			list.add(row);
		}
		return list;
	}
	
	public void startJob(String name, String group) throws SecurityException {
		checkUser();
		Core.getInstance().getScheduler().runJob(name, group);
	}
}
