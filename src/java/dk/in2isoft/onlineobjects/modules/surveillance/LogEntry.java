package dk.in2isoft.onlineobjects.modules.surveillance;

import java.util.Date;

public class LogEntry {

	enum Level {info,warn,error}
	
	private Date date;
	private String title;
	private String details;
	private Level level;

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
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
}
