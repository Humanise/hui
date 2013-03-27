package dk.in2isoft.onlineobjects.modules.scheduling;

import org.apache.commons.collections.Buffer;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.quartz.JobListener;
import org.quartz.SchedulerException;
import org.quartz.SchedulerListener;
import org.quartz.Trigger;
import org.quartz.Trigger.CompletedExecutionInstruction;
import org.quartz.TriggerKey;
import org.quartz.TriggerListener;
import org.quartz.utils.Key;

import dk.in2isoft.onlineobjects.modules.surveillance.LogEntry;

public class LoggingSchedulerListener implements SchedulerListener, JobListener, TriggerListener {
	
	private Buffer log;

	public LoggingSchedulerListener(Buffer log) {
		this.log = log;
	}
	
	private void log(String text, Key<?> key) {
		log.add(new LogEntry("- "+text,key.getName(),key.getGroup()));
	}

	private void log(String text) {
		log.add(new LogEntry("- "+text));
	}

	public void jobScheduled(Trigger trigger) {
		log("Job scheduled",trigger.getKey());
	}

	public void jobUnscheduled(TriggerKey triggerKey) {
		log("Job unscheduled",triggerKey);
	}

	public void triggerFinalized(Trigger trigger) {
		log("Trigger finalized",trigger.getKey());
	}

	public void triggerPaused(TriggerKey triggerKey) {
		log("Trigger paused",triggerKey);
	}

	public void triggersPaused(String triggerGroup) {
		log("Triggers paused",TriggerKey.triggerKey("?", triggerGroup));
	}

	public void triggerResumed(TriggerKey triggerKey) {
		log("Trigger resumed",triggerKey);
	}

	public void triggersResumed(String triggerGroup) {
		log("Triggers resumed",TriggerKey.triggerKey("?", triggerGroup));
	}

	public void jobAdded(JobDetail jobDetail) {
		log("Job added",jobDetail.getKey());
	}

	public void jobDeleted(JobKey jobKey) {
		log("Job deleted",jobKey);
	}

	public void jobPaused(JobKey jobKey) {
		log("Job paused",jobKey);
	}

	public void jobsPaused(String jobGroup) {
		log("Jobs paused",JobKey.jobKey("?", jobGroup));
	}

	public void jobResumed(JobKey jobKey) {
		log("Job resumed",jobKey);
	}

	public void jobsResumed(String jobGroup) {
		log("Jobs rsumed",JobKey.jobKey("?", jobGroup));
	}

	public void schedulerError(String msg, SchedulerException cause) {
		log("Scheduler error: "+msg);
	}

	public void schedulerInStandbyMode() {
		log("Scheduler in stand by mode");
	}

	public void schedulerStarted() {
		log("Scheduler started");
	}

	public void schedulerShutdown() {
		log("Scheduler shut down");
	}

	public void schedulerShuttingdown() {
		log("Scheduler shutting down");
	}

	public void schedulingDataCleared() {
		log("Scheduling data cleared");
	}

	public String getName() {
		return getClass().getSimpleName();
	}

	public void jobToBeExecuted(JobExecutionContext context) {
		log("Job to be executed",context.getJobDetail().getKey());
	}

	public void jobExecutionVetoed(JobExecutionContext context) {
		log("Job execution vetoed",context.getJobDetail().getKey());
	}

	public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
		log("Job was executed",context.getJobDetail().getKey());

	}

	public void triggerFired(Trigger trigger, JobExecutionContext context) {
		log("Trigger fired",trigger.getKey());
	}

	public boolean vetoJobExecution(Trigger trigger, JobExecutionContext context) {
		return false;
	}

	public void triggerMisfired(Trigger trigger) {
		log("Trigger misfired",trigger.getKey());

	}

	public void triggerComplete(Trigger trigger, JobExecutionContext context, CompletedExecutionInstruction triggerInstructionCode) {
		// TODO Auto-generated method stub
		
	}

}
