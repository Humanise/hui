package dk.in2isoft.onlineobjects.modules.scheduling;

import java.util.Map;

import org.quartz.Job;

public class JobDescription {
	
	private Class<? extends Job> jobClass;
	
	private String group;
	
	private String name;
	
	private String cron;
	
	private int repeatMinutes;

	private Map<String,Object> properties;
	
	private boolean paused;
	
	public Class<? extends Job> getJobClass() {
		return jobClass;
	}

	public void setJobClass(Class<? extends Job> jobClass) {
		this.jobClass = jobClass;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCron() {
		return cron;
	}

	public void setCron(String cron) {
		this.cron = cron;
	}

	public int getRepeatMinutes() {
		return repeatMinutes;
	}

	public void setRepeatMinutes(int repeatMinutes) {
		this.repeatMinutes = repeatMinutes;
	}

	public Map<String,Object> getProperties() {
		return properties;
	}

	public void setProperties(Map<String,Object> properties) {
		this.properties = properties;
	}

	public boolean isPaused() {
		return paused;
	}

	public void setPaused(boolean paused) {
		this.paused = paused;
	}
}
