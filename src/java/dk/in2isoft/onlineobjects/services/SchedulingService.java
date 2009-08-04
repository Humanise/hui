package dk.in2isoft.onlineobjects.services;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.quartz.CronTrigger;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.impl.StdSchedulerFactory;

public class SchedulingService {

	private final static Logger log = Logger.getLogger(SchedulingService.class);

	private org.quartz.Scheduler scheduler;

	protected SchedulingService() {
		try {
			scheduler = StdSchedulerFactory.getDefaultScheduler();
			scheduler.start();
		} catch (SchedulerException e) {
			log.error(e.getMessage(), e);
		}
	}

	public void scheduleJob(JobDetail detail, Trigger trigger) {
		try {
			scheduler.scheduleJob(detail, trigger);
		} catch (SchedulerException e) {
			log.error(e.getMessage(), e);
		}
	}
	
	public Map<String,String> listJobs() {
		Map<String, String> list = new HashMap<String, String>();
		try {
			for (String group : scheduler.getJobGroupNames()) {
				for (String name : scheduler.getJobNames(group)) {
					list.put(name, group);
				}
			}
		} catch (SchedulerException e) {
			log.error(e.getMessage(),e);
		}
		return list;
	}
	
	@SuppressWarnings("unchecked")
	public boolean isRunning(String name, String group) {
		List<JobExecutionContext> jobs;
		try {
			jobs = scheduler.getCurrentlyExecutingJobs();
			for (JobExecutionContext context : jobs) {
				JobDetail detail = context.getJobDetail();
				if (name.equals(detail.getName()) && group.equals(detail.getGroup())) {
					return true;
				}
			}
		} catch (SchedulerException e) {
			log.error(e.getMessage(), e);
		}
		return false;
	}
	
	public void runJob(String name, String group) {
		if (isRunning(name, group)) {
			log.warn("Job is running!");
			return;
		}
		try {
			scheduler.triggerJob(name, group);
		} catch (SchedulerException e) {
			log.error(e.getMessage(), e);
		}
	}

	public void addJob(String name, String group, Class<?> jobClass, String cron, JobDataMap map) {

		JobDetail detail = new JobDetail(name, group, jobClass);
		if (map!=null) {
			detail.setJobDataMap(map);
		}
		CronTrigger trigger = new CronTrigger(name, group);
		try {
			trigger.setCronExpression(cron);
		} catch (ParseException e) {
			log.error(e.getMessage(),e);
		}
		scheduleJob(detail, trigger);
	}
}
