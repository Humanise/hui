package dk.in2isoft.onlineobjects.modules.onlinepublisher;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.UnableToInterruptJobException;

import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

@DisallowConcurrentExecution
public class OnlinePublisherJob extends ServiceBackedJob implements InterruptableJob {

	private boolean interrupted;
	
	public void execute(JobExecutionContext context) throws JobExecutionException {
		JobStatus status = getStatus(context);
		OnlinePublisherService publisherService = schedulingSupportFacade.getOnlinePublisherService();
		publisherService.callAllPublishers(status);
		
	}

	public void interrupt() throws UnableToInterruptJobException {
		interrupted = true;
	}

}
