package dk.in2isoft.onlineobjects.modules.information;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.UnableToInterruptJobException;

import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

@DisallowConcurrentExecution
public class SimilarityJob extends ServiceBackedJob implements InterruptableJob {
	
	public void execute(JobExecutionContext context) throws JobExecutionException {
		InformationService informationService = schedulingSupportFacade.getInformationService();
		JobStatus status = getStatus(context);
		status.setProgress(0);
		informationService.calculateNextMissingSimilary(status);
		status.setProgress(1);
	}

	public void interrupt() throws UnableToInterruptJobException {
		// TODO
	}

}
