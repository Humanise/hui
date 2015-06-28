package dk.in2isoft.onlineobjects.modules.surveillance;

import dk.in2isoft.onlineobjects.ui.Request;

public class RequestInfo {
	
	private long totalRunningTime;
	private long maxRunningTime;
	private long minRunningTime;
	private long averageRunningTime;
	private String uri;
	private int counts;
	
	public RequestInfo(Request request) {
		this.maxRunningTime = request.getRunningTime();
		this.minRunningTime = maxRunningTime;
		this.averageRunningTime = maxRunningTime;
		this.totalRunningTime = maxRunningTime;
		uri = request.getRequest().getRequestURI();
		counts = 1;
	}
	
	public void merge(Request request) {
		if (!request.getRequest().getRequestURI().equals(uri)) {
			throw new IllegalArgumentException("Not the same URI");
		}
		long runningTime = request.getRunningTime();
		maxRunningTime = Math.max(maxRunningTime, runningTime);
		minRunningTime = Math.min(minRunningTime, runningTime);
		totalRunningTime+=runningTime;
		counts++;
		averageRunningTime = totalRunningTime/counts;
	}
	
	public long getMaxRunningTime() {
		return maxRunningTime;
	}
	
	public long getMinRunningTime() {
		return minRunningTime;
	}
	
	public long getAverageRunningTime() {
		return averageRunningTime;
	}
	
	public int getCounts() {
		return counts;
	}

	public String getUri() {
		return uri;
	}

	public long getTotalRunningTime() {
		// TODO Auto-generated method stub
		return totalRunningTime;
	}
}
