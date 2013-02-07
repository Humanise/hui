package dk.in2isoft.onlineobjects.modules.scheduling;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;


public class HelloWorldJob extends ServiceBackedJob {
		
	public void execute(JobExecutionContext context) throws JobExecutionException {
		System.out.println("Hello world! "+schedulingSupportFacade);
	}

}
