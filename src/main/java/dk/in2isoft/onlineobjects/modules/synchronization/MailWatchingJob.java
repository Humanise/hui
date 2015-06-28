package dk.in2isoft.onlineobjects.modules.synchronization;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

@DisallowConcurrentExecution
public class MailWatchingJob extends ServiceBackedJob {
		
	public void execute(JobExecutionContext context) throws JobExecutionException {
		JobStatus status = getStatus(context);
		schedulingSupportFacade.getMailWatchingService().check(status);
	}
	
}
