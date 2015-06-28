package dk.in2isoft.onlineobjects.modules.surveillance;

import java.util.Date;

public class LogEntry {

	public enum Level {info,warn,error}
	
	private Date date;
	private String title;
	private String details;
	private Level level;
	private String name;
	private String group;

	public LogEntry() {
		this.date = new Date();
		this.level = Level.info;
	}
	
	public LogEntry(String text) {
		this();
		this.title = text;
	}

	public LogEntry(String text, String name, String group) {
		this();
		this.title = text;
		this.name = name;
		this.group = group;
	}

	public Date getDate() {
		return date;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public Level getLevel() {
		return level;
	}

	public void setLevel(Level level) {
		this.level = level;
	}

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
}
