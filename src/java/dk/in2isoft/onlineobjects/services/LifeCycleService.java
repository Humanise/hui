package dk.in2isoft.onlineobjects.services;

import java.util.Date;

public class LifeCycleService {

	private Date startTime;
	
	public LifeCycleService() {
		startTime = new Date();
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getStartTime() {
		return startTime;
	}
}
