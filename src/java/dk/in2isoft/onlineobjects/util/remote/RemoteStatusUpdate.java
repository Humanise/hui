package dk.in2isoft.onlineobjects.util.remote;

import java.util.Date;

public class RemoteStatusUpdate {

	private Date date;
	private String text;

	public void setDate(Date date) {
		this.date = date;
	}

	public Date getDate() {
		return date;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}
}
