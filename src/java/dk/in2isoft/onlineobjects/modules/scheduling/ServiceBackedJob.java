package dk.in2isoft.onlineobjects.modules.scheduling;

import org.quartz.Job;

public abstract class ServiceBackedJob implements Job {

	protected SchedulingSupportFacade schedulingSupportFacade;
	

	public void setSchedulingSupportFacade(SchedulingSupportFacade schedulingSupportFacade) {
		this.schedulingSupportFacade = schedulingSupportFacade;
	}
}
