package dk.in2isoft.onlineobjects.modules.scheduling;

import org.quartz.Job;
import org.quartz.JobExecutionContext;

public abstract class ServiceBackedJob implements Job {

	protected SchedulingSupportFacade schedulingSupportFacade;
	
	protected JobStatus getStatus(JobExecutionContext context) {
		return JobStatus.getOrCreate(context,schedulingSupportFacade.getSchedulingService(),this);
	}

	public void setSchedulingSupportFacade(SchedulingSupportFacade schedulingSupportFacade) {
		this.schedulingSupportFacade = schedulingSupportFacade;
	}
}
