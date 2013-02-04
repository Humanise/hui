package dk.in2isoft.onlineobjects.modules.scheduling;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.joda.time.DateTime;
import org.quartz.CronScheduleBuilder;
import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;
import org.quartz.impl.matchers.GroupMatcher;
import org.quartz.spi.MutableTrigger;
import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.words.index.HelloWorldJob;
import dk.in2isoft.onlineobjects.apps.words.index.WordIndexJob;
import dk.in2isoft.onlineobjects.modules.images.ImageCleanupJob;
import dk.in2isoft.onlineobjects.modules.information.InformationSpiderJob;
import dk.in2isoft.onlineobjects.modules.synchronization.MailWatchingJob;

public class SchedulingService implements InitializingBean {

	private final static Logger log = Logger.getLogger(SchedulingService.class);
	
	private SchedulingSupportFacade schedulingSupportFacade;

	private org.quartz.Scheduler scheduler;

	public void afterPropertiesSet() throws Exception {
		SchedulerFactory sf = new StdSchedulerFactory();
		scheduler = sf.getScheduler();
		
		{
			JobDetail job = JobBuilder.newJob(WordIndexJob.class)
				    .withIdentity("indexwords", "core").storeDurably()
				    .build();
			scheduler.addJob(job, true);
		}
		{
			JobDetail job = JobBuilder.newJob(HelloWorldJob.class)
				    .withIdentity("hello", "core").storeDurably()
				    .build();
			job.getJobDataMap().put("schedulingSupportFacade", schedulingSupportFacade);
			scheduler.addJob(job, true);
			scheduler.scheduleJob(TriggerBuilder.newTrigger().forJob(job).withSchedule(SimpleScheduleBuilder.repeatMinutelyForever()).build());
		}
		{
			JobDetail job = JobBuilder.newJob(ImageCleanupJob.class)
				    .withIdentity("clean-images", "core").storeDurably()
				    .build();
			job.getJobDataMap().put("schedulingSupportFacade", schedulingSupportFacade);
			scheduler.addJob(job, true);
		}
		{
			JobDetail job = JobBuilder.newJob(MailWatchingJob.class)
				    .withIdentity("mailwatcher", "core").storeDurably()
				    .build();
			job.getJobDataMap().put("schedulingSupportFacade", schedulingSupportFacade);
			scheduler.addJob(job, true);
			scheduler.scheduleJob(TriggerBuilder.newTrigger().forJob(job).withSchedule(SimpleScheduleBuilder.repeatMinutelyForever()).build());
			
		}
		 {
			JobDetail job = JobBuilder.newJob(InformationSpiderJob.class)
				    .withIdentity("info-spider", "core").storeDurably()
				    .build();
			job.getJobDataMap().put("schedulingSupportFacade", schedulingSupportFacade);
			scheduler.addJob(job, true);
			if (false) {
				SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.repeatMinutelyForever(5);
				Date startTime = DateTime.now().plusSeconds(30).toDate();
				scheduler.scheduleJob(TriggerBuilder.newTrigger().forJob(job).withSchedule(scheduleBuilder).startAt(startTime).build());
			}
		}
		scheduler.start();
	}
	
	public void setCoreScheduler(Scheduler coreSchedulerFactory) {
		this.scheduler = coreSchedulerFactory;
	}

	protected SchedulingService() {
		/*try {
			scheduler = StdSchedulerFactory.getDefaultScheduler();
			scheduler.start();
		} catch (SchedulerException e) {
			log.error(e.getMessage(), e);
		}*/
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
			List<String> groupNames = scheduler.getJobGroupNames();
			for (String group : groupNames) {
				Set<JobKey> jobKeys = scheduler.getJobKeys(GroupMatcher.jobGroupEquals(group));
				for (JobKey key : jobKeys) {
					JobDetail jobDetail = scheduler.getJobDetail(key);
					jobDetail.getDescription();
					list.put(key.getName(),key.getGroup());
				}
			}
		} catch (SchedulerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return list;
	}
	
	public boolean isRunning(String name, String group) {
		try {
			List<JobExecutionContext> executingJobs = scheduler.getCurrentlyExecutingJobs();
			for (JobExecutionContext context : executingJobs) {
				JobKey key = context.getJobDetail().getKey();
				if (group.equals(key.getGroup()) && name.equals(key.getName())) {
					return true;
				}
			}
		} catch (SchedulerException e) {
			log.error("Exception while checking if job is running", e);
		}
		return false;
	}
	
	public void runJob(String name, String group) {
		try {
			JobDetail jobDetail = scheduler.getJobDetail(JobKey.jobKey(name, group));
			if (jobDetail!=null) {				
				scheduler.triggerJob(JobKey.jobKey(name, group));
			}
		} catch (SchedulerException e) {
			log.error("Exception while running job", e);
		}
	}
	
	public Date getLatestExecution(String name, String group) {
		List<? extends Trigger> triggers = getJobDetail(name, group);
		if (triggers!=null) {
			for (Trigger trigger : triggers) {
				return trigger.getPreviousFireTime();
			}
		}
		return null;
	}

	public Date getNextExecution(String name, String group) {
		List<? extends Trigger> triggers = getJobDetail(name, group);
		if (triggers!=null) {
			for (Trigger trigger : triggers) {
				return trigger.getNextFireTime();
			}
		}
		return null;
	}
	
	private List<? extends Trigger> getJobDetail(String name, String group) {
		try {
			JobDetail detail = scheduler.getJobDetail(JobKey.jobKey(name, group));
			return scheduler.getTriggersOfJob(detail.getKey());
		} catch (SchedulerException e) {
			log.error("Exception while running job", e);
		}		
		return null;
		
	}

	public boolean addJob(String name, String group, Class<? extends Job> jobClass, String cron, JobDataMap map) {

		JobDetail jobDetail = JobBuilder.newJob().withIdentity(name, group).ofType(jobClass).usingJobData(map).build();
		MutableTrigger trigger = CronScheduleBuilder.cronSchedule(cron).build();
		try {
			scheduler.scheduleJob(jobDetail, trigger);
			return true;
		} catch (SchedulerException e) {
			return false;
		}
	}
	
	public void setSchedulingSupportFacade(SchedulingSupportFacade schedulingSupportFacade) {
		this.schedulingSupportFacade = schedulingSupportFacade;
	}
}
