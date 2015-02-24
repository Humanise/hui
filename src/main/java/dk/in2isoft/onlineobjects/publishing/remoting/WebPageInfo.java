package dk.in2isoft.onlineobjects.publishing.remoting;

import java.util.Collection;

public class WebPageInfo {
	private long id; 
	private String pageTitle;
	private String siteTitle;
	private String nodeTitle;
	private Collection<String> tags;

	public void setId(long id) {
		this.id = id;
	}

	public long getId() {
		return id;
	}
	
	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}

	public String getPageTitle() {
		return pageTitle;
	}

	public void setSiteTitle(String siteTitle) {
		this.siteTitle = siteTitle;
	}

	public String getSiteTitle() {
		return siteTitle;
	}

	public void setNodeTitle(String nodeTitle) {
		this.nodeTitle = nodeTitle;
	}

	public String getNodeTitle() {
		return nodeTitle;
	}

	public void setTags(Collection<String> tags) {
		this.tags = tags;
	}

	public Collection<String> getTags() {
		return tags;
	}
}
