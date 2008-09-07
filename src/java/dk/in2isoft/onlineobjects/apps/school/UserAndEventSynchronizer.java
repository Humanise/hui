package dk.in2isoft.onlineobjects.apps.school;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dk.in2isoft.onlineobjects.apps.school.sync.EasyFetcherStage;
import dk.in2isoft.onlineobjects.pipes.Pipeline;

public class UserAndEventSynchronizer implements Job {
	
	public static final String CONFIG_URL = "url";
	public static final String CONFIG_SERVERNAME = "serverName";
	public static final String CONFIG_PORTNUMBER = "portNumber";
	public static final String CONFIG_DATABASENAME = "databaseName";
	public static final String CONFIG_USER = "user";
	public static final String CONFIG_PASSWORD = "password";
	
	public UserAndEventSynchronizer() {
		super();
	}

	public void execute(JobExecutionContext context) throws JobExecutionException {
		JobDataMap map = context.getMergedJobDataMap();
		//String url = map.getString(CONFIG_URL);
		String serverName = map.getString(CONFIG_SERVERNAME); 
		Integer portNumber = map.getInt(CONFIG_PORTNUMBER); 
		String databaseName = map.getString(CONFIG_DATABASENAME); 
		String user = map.getString(CONFIG_USER); 
		String password = map.getString(CONFIG_PASSWORD);
		Pipeline pipeline = new Pipeline();
		
		EasyFetcherStage fetcher = new EasyFetcherStage();
		fetcher.setServerName(serverName);
		fetcher.setPortNumber(portNumber);
		fetcher.setDatabaseName(databaseName);
		fetcher.setUser(user);
		fetcher.setPassword(password);
		/*
		FileFetcherStage fetcher = new FileFetcherStage(url);
		
		pipeline.addStage(fetcher);
		
		pipeline.addStage(new CSVParserStage());
		*/
		pipeline.addStage(fetcher);
		pipeline.addStage(new SynchronizerStage());
		
		pipeline.run();
	}
}
