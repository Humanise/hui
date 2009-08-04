package dk.in2isoft.onlineobjects.apps.school;

import java.io.IOException;

import org.quartz.JobDataMap;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.services.SchedulingService;
import dk.in2isoft.onlineobjects.ui.Request;

public class SchoolController extends ApplicationController {

	//private final static Logger log = Logger.getLogger(SchoolController.class);
	
	public static final String JOB_SYNCHRONIZER = "Synchronizer";
	private SchedulingService schedulingService;
	
	private String syncUrl;

	public SchoolController() {
		super("school");
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		super.afterPropertiesSet();
		String trigger = getConfig().getString("synchronization.trigger");
		JobDataMap map = new JobDataMap();

		String url = getConfig().getString("synchronization.url");
		String serverName = getConfig().getString("synchronization.database.server-name");
		Integer portNumber = getConfig().getInt("synchronization.database.port-number",0);
		System.out.println(portNumber);
		String databaseName = getConfig().getString("synchronization.database.database-name");
		String user = getConfig().getString("synchronization.database.user");
		String password= getConfig().getString("synchronization.database.password");
		map.put(UserAndEventSynchronizer.CONFIG_URL, url);
		map.put(UserAndEventSynchronizer.CONFIG_SERVERNAME, serverName);
		map.put(UserAndEventSynchronizer.CONFIG_PORTNUMBER, portNumber);
		map.put(UserAndEventSynchronizer.CONFIG_DATABASENAME, databaseName);
		map.put(UserAndEventSynchronizer.CONFIG_USER, user);
		map.put(UserAndEventSynchronizer.CONFIG_PASSWORD, password);
		schedulingService.addJob(JOB_SYNCHRONIZER,"school",UserAndEventSynchronizer.class,trigger,map);
	}



	public String getSyncUrl() {
		return syncUrl;
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		if (!showGui(request)) {
			throw new EndUserException("Unknown request");
		}
	}

	public void setSchedulingService(SchedulingService schedulingService) {
		this.schedulingService = schedulingService;
	}

	public SchedulingService getSchedulingService() {
		return schedulingService;
	}
}
