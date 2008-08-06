package dk.in2isoft.onlineobjects.model;

import java.util.Date;

public class Event extends Entity {

	public static String TYPE = Entity.TYPE+"/Event";
	public static String NAMESPACE = Entity.NAMESPACE+"Event/";
	private static String ICON = "common/object";

	public static final String FIELD_STARTTIME = "startTime";
	public static final String FIELD_ENDTIME = "endTime";
	
	private Date startTime;
	private Date endTime;
	private String location;

	public Event() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return ICON;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	
	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
}
