package dk.in2isoft.in2igui.data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

public class EventData {

	private long id;
	private Date startTime;
	private Date endTime;
	private String text;
	private String location;
	private Collection<ObjectData> attendees = new ArrayList<ObjectData>();
	private Collection<ObjectData> organizers = new ArrayList<ObjectData>();

	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
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
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Collection<ObjectData> getAttendees() {
		return attendees;
	}
	public void setAttendees(Collection<ObjectData> attendees) {
		this.attendees = attendees;
	}
	public Collection<ObjectData> getOrganizers() {
		return organizers;
	}
	public void setOrganizers(Collection<ObjectData> organizers) {
		this.organizers = organizers;
	}
	
	public void addAttendee(long id,String title) {
		attendees.add(new ObjectData(id,title));
	}
	
	public void addOrganizer(long id,String title) {
		organizers.add(new ObjectData(id,title));
	}
}
