package dk.in2isoft.onlineobjects.modules.scheduling;

import java.util.Date;

public class JobInfo {

	private String name;
	private String group;
	private Date latestRun;
	private Date nextRun;
	private boolean running;
	private String triggerState;
	private String triggerTiming;
	private long currentRunTime;
	private float progress;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public Date getLatestRun() {
		return latestRun;
	}

	public void setLatestRun(Date latestRun) {
		this.latestRun = latestRun;
	}

	public Date getNextRun() {
		return nextRun;
	}

	public void setNextRun(Date nextRun) {
		this.nextRun = nextRun;
	}

	public boolean isRunning() {
		return running;
	}

	public void setRunning(boolean running) {
		this.running = running;
	}

	public void setTriggerState(String triggerState) {
		this.triggerState = triggerState;
	}
	
	public String getTriggerState() {
		return triggerState;
	}

	public String getTriggerTiming() {
		return triggerTiming;
	}

	public void setTriggerTiming(String triggerTiming) {
		this.triggerTiming = triggerTiming;
	}

	public long getCurrentRunTime() {
		return currentRunTime;
	}

	public void setCurrentRunTime(long currentRunTime) {
		this.currentRunTime = currentRunTime;
	}

	public float getProgress() {
		return progress;
	}

	public void setProgress(float progress) {
		this.progress = progress;
	}
}
