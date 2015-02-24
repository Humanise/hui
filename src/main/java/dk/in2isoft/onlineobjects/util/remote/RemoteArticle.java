package dk.in2isoft.onlineobjects.util.remote;

import java.util.Date;

public class RemoteArticle {
	private Date date;
	private String title;
	private String markup;
	private String url;

	public void setDate(Date date) {
		this.date = date;
	}

	public Date getDate() {
		return date;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getTitle() {
		return title;
	}

	public void setMarkup(String markup) {
		this.markup = markup;
	}

	public String getMarkup() {
		return markup;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getUrl() {
		return url;
	}
}
