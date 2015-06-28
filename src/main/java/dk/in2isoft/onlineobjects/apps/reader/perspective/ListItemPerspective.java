package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import dk.in2isoft.onlineobjects.core.Pair;

public class ListItemPerspective {
	
	private long id;
	private String title;
	private String url;
	private String address;
	private List<Pair<Long,String>> tags;
	private String html;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<Pair<Long,String>> getTags() {
		return tags;
	}

	public void setTags(List<Pair<Long,String>> tags) {
		this.tags = tags;
	}

	public String getHtml() {
		return html;
	}

	public void setHtml(String html) {
		this.html = html;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
}
