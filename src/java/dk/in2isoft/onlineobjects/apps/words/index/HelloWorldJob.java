package dk.in2isoft.onlineobjects.apps.words.index;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

public class HelloWorldJob extends ServiceBackedJob {
		
	public void execute(JobExecutionContext context) throws JobExecutionException {
		System.out.println("Hello world! "+schedulingSupportFacade);
	}

}
