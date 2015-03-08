package dk.in2isoft.onlineobjects.modules.scheduling;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.Buffer;
import org.apache.commons.collections.BufferUtils;
import org.apache.commons.collections.buffer.CircularFifoBuffer;
import org.apache.log4j.Logger;
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.SimpleTrigger;
import org.quartz.Trigger;
import org.quartz.Trigger.TriggerState;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;
import org.quartz.impl.matchers.GroupMatcher;
import org.quartz.utils.Key;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ApplicationContextEvent;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.ContextRefreshedEvent;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.modules.surveillance.LogEntry;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class SchedulingService implements ApplicationListener<ApplicationContextEvent>, InitializingBean {

	private final static Logger log = Logger.getLogger(SchedulingService.class);
	
	private Buffer liveLog = BufferUtils.synchronizedBuffer(new CircularFifoBuffer(200));
	
	private SchedulingSupportFacade schedulingSupportFacade;
	
	private ConfigurationService configurationService;

	private org.quartz.Scheduler scheduler;
	
	private List<JobDescription> jobDescriptions;
	
	private Map<JobKey,String> triggerDescriptions = Maps.newHashMap();

	public void onApplicationEvent(ApplicationContextEvent event) {
		
		if (event instanceof ContextRefreshedEvent) {
			try {
				if (jobDescriptions!=null) {
					for (JobDescription desc : jobDescriptions) {
						JobDetail job = JobBuilder.newJob(desc.getJobClass())
							    .withIdentity(desc.getName(), desc.getGroup()).storeDurably()
							    .build();
						if (desc.getProperties()!=null) {
							job.getJobDataMap().putAll(desc.getProperties());
						}
						job.getJobDataMap().put("schedulingSupportFacade", schedulingSupportFacade);
						scheduler.addJob(job, true);
						if (Strings.isNotBlank(desc.getCron()) || desc.getRepeatMinutes()>0) {
							if (Strings.isNotBlank(desc.getCron())) {
								CronScheduleBuilder schedule = CronScheduleBuilder.cronSchedule(desc.getCron());
								scheduler.scheduleJob(TriggerBuilder.newTrigger().forJob(job).withSchedule(schedule).build());
								triggerDescriptions.put(job.getKey(), "cron: "+desc.getCron());
							} else if (desc.getRepeatMinutes()>0) {
								SimpleScheduleBuilder schedule = SimpleScheduleBuilder.repeatMinutelyForever(desc.getRepeatMinutes());
								SimpleTrigger trigger = TriggerBuilder.newTrigger().forJob(job).withSchedule(schedule).withIdentity(desc.getName(), desc.getGroup()).build();
								scheduler.scheduleJob(trigger);
								triggerDescriptions.put(job.getKey(), "min:  "+desc.getRepeatMinutes());
							}
							if (desc.isPaused() || !configurationService.isStartScheduling()) {
								scheduler.pauseJob(job.getKey());
							}
						}
					}
				}
				scheduler.start();
			} catch (SchedulerException e) {
				log.error("Problem starting scheduler", e);
			}
		}
		if (event instanceof ContextClosedEvent) {
			if (scheduler!=null) {
				try {
					log.info("Shutting down scheduler");
					scheduler.shutdown();
					log.info("Scheduler is shut down");
				} catch (SchedulerException e) {
					log.error("Problem shutting down scheduler", e);
				}
			}
		}
	}
	
	
	
	public void afterPropertiesSet() throws Exception {
		SchedulerFactory sf = new StdSchedulerFactory();
		scheduler = sf.getScheduler();
		LoggingSchedulerListener listener = new LoggingSchedulerListener(liveLog);
		scheduler.getListenerManager().addSchedulerListener(listener);
		scheduler.getListenerManager().addJobListener(listener);
		scheduler.getListenerManager().addTriggerListener(listener);
		
	}
	
	public void log(String text) {
		liveLog.add(new LogEntry(text));
	}
	
	public void log(String text, Key<?> key) {
		if (key==null) {
			log(text);
		} else {
			liveLog.add(new LogEntry(text,key.getName(),key.getGroup()));			
		}
	}

	public void warn(String text, Key<?> key) {
		LogEntry entry;
		if (key!=null) {
			entry = new LogEntry(text,key.getName(),key.getGroup());			
		} else {
			entry = new LogEntry(text);
		}
		entry.setLevel(LogEntry.Level.warn);
		liveLog.add(entry);
	}

	public void error(String text, Key<?> key) {
		LogEntry entry = new LogEntry(text);
		if (key!=null) {
			entry.setName(key.getName());
			entry.setGroup(key.getName());			
		}
		entry.setLevel(LogEntry.Level.error);
		liveLog.add(entry);
	}

	public void start() {
		try {
			log("Starting schduler");
			scheduler.start();
		} catch (SchedulerException e) {
			log.error("Unable to start scheduler",e);
		}
	}
	
	public void pause() {
		try {
			log("Pausing scheduler");
			scheduler.standby();
		} catch (SchedulerException e) {
			log.error("Unable to pause scheduler",e);
		}
	}
	
	public boolean isRunning() {
		try {
			return !scheduler.isInStandbyMode() && scheduler.isStarted();
		} catch (SchedulerException e) {
			log.error("Error checking scheduler status",e);
		}
		return false;
	}
	
	public void toggle() {
		try {
			if (scheduler.isInStandbyMode() || !scheduler.isStarted()) {
				log("Resuming scheduler");
				log.info("Resuming scheduling service");
				scheduler.start();
			} else {
				log("Pausing scheduler");
				log.info("Pausing scheduling service");
				scheduler.standby();
			}
		} catch (SchedulerException e) {
			log.error("Unable to pause scheduler",e);
		}
		
	}
	
	public void setActive(boolean active) {
		try {
			if (active) {
				if (scheduler.isInStandbyMode() || !scheduler.isStarted()) {
					log("Activating scheduler");
					log.info("Activating scheduling service");
					scheduler.start();
				} else {
					log.info("Scheduling service already active");
				}
			} else {
				if (!scheduler.isInStandbyMode() || scheduler.isStarted()) {
					log("Pausing scheduler");
					log.info("Deactivating scheduling service");
					scheduler.standby();
				} else {
					log.info("Scheduling service already inactive");
				}				
			}
		} catch (SchedulerException e) {
			log.error("Unable to pause scheduler",e);
		}
	}

	public void setCoreScheduler(Scheduler coreSchedulerFactory) {
		this.scheduler = coreSchedulerFactory;
	}
	
	public List<JobInfo> getJobList() {
		List<JobInfo> list = Lists.newArrayList();
		try {
			List<String> groupNames = scheduler.getJobGroupNames();
			List<JobExecutionContext> executingJobs = scheduler.getCurrentlyExecutingJobs();
			long now = System.currentTimeMillis();
			for (String group : groupNames) {
				Set<JobKey> jobKeys = scheduler.getJobKeys(GroupMatcher.jobGroupEquals(group));
				for (JobKey key : jobKeys) {
					JobDetail jobDetail = scheduler.getJobDetail(key);
					jobDetail.getDescription();
					
					JobInfo status = new JobInfo();
					status.setGroup(key.getGroup());
					status.setName(key.getName());
					for (JobExecutionContext context : executingJobs) {
						if (context.getJobDetail().getKey().equals(key)) {
							status.setRunning(true);
							status.setCurrentRunTime(now-context.getFireTime().getTime());
							JobStatus jobStatus = JobStatus.get(context);
							if (jobStatus!=null) {
								status.setProgress(jobStatus.getProgress());
							}
							break;
						}
					}
					
					List<? extends Trigger> triggers = scheduler.getTriggersOfJob(key);
					if (triggers!=null && !triggers.isEmpty()) {
						Trigger trigger = triggers.get(0);
						status.setLatestRun(trigger.getPreviousFireTime());
						status.setNextRun(trigger.getNextFireTime());
						TriggerState state = scheduler.getTriggerState(trigger.getKey());
						status.setTriggerState(state.name());
						status.setTriggerTiming(triggerDescriptions.get(key));
					}
					list.add(status);
				}
			}
		} catch (SchedulerException e) {
			log.error(e.getMessage(),e);
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
			JobKey key = JobKey.jobKey(name, group);
			JobDetail jobDetail = scheduler.getJobDetail(key);
			if (jobDetail!=null) {
				log("Running job",key);
				scheduler.triggerJob(key);
			}
		} catch (SchedulerException e) {
			log.error("Exception while running job", e);
		}
	}
	
	public void pauseJob(String name, String group) {
		try {
			JobKey key = JobKey.jobKey(name, group);
			JobDetail jobDetail = scheduler.getJobDetail(key);
			if (jobDetail!=null) {
				log("Pausing job"+key);
				scheduler.pauseJob(key);
			}
		} catch (SchedulerException e) {
			log.error("Exception while running job", e);
		}
	}

	public void resumeJob(String name, String group) {
		try {
			JobKey key = JobKey.jobKey(name, group);
			JobDetail jobDetail = scheduler.getJobDetail(key);
			if (jobDetail!=null) {				
				log("Resuming job",key);
				scheduler.resumeJob(key);
			}
		} catch (SchedulerException e) {
			log.error("Exception while running job", e);
		}
	}

	public void stopJob(String name, String group) {
		try {
			JobKey key = JobKey.jobKey(name, group);
			JobDetail jobDetail = scheduler.getJobDetail(key);
			if (jobDetail!=null) {				
				log("Stopping job",key);
				scheduler.interrupt(key);
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

	public List<LogEntry> getLiveLog() {
		List<LogEntry> entries = Lists.newArrayList();
		for (Object object : liveLog) {
			if (object instanceof LogEntry) {
				entries.add((LogEntry) object);
			}
		}
		Collections.reverse(entries);
		return entries;
	}
	
	// Wiring...
	
	public void setSchedulingSupportFacade(SchedulingSupportFacade schedulingSupportFacade) {
		this.schedulingSupportFacade = schedulingSupportFacade;
	}

	public void setJobDescriptions(List<JobDescription> jobDescriptions) {
		this.jobDescriptions = jobDescriptions;
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
}
