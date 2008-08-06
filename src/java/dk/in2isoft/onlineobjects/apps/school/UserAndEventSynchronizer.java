package dk.in2isoft.onlineobjects.apps.school;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dk.in2isoft.onlineobjects.pipes.FileFetcherStage;
import dk.in2isoft.onlineobjects.pipes.CSVParserStage;
import dk.in2isoft.onlineobjects.pipes.Pipeline;

public class UserAndEventSynchronizer implements Job {
	
	public static final String CONFIG_URL = "url";
	
	public UserAndEventSynchronizer() {
		super();
	}

	public void execute(JobExecutionContext context) throws JobExecutionException {
		String url = context.getMergedJobDataMap().getString(CONFIG_URL);
		Pipeline pipeline = new Pipeline();
		
		FileFetcherStage fetcher = new FileFetcherStage(url);
		
		pipeline.addStage(fetcher);
		
		pipeline.addStage(new CSVParserStage());
		
		pipeline.addStage(new SynchronizerStage());
		
		pipeline.run();
	}
}
