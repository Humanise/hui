package dk.in2isoft.onlineobjects.modules.photos;

import java.util.Set;

import com.google.common.collect.Sets;

import dk.in2isoft.onlineobjects.core.Privileged;

public class PhotoQuery {

	private Privileged owner;
	private Privileged viewer;
	private String text;
	private int page;
	private int pageSize;
	private Set<Long> wordIds = Sets.newHashSet();
	
	public PhotoQuery withOwner(Privileged privileged) {
		this.owner = privileged;
		return this;
	}
	
	public PhotoQuery withViewer(Privileged privileged) {
		this.viewer = privileged;
		return this;
	}
	
	public PhotoQuery withText(String text) {
		this.text = text;
		return this;
	}

	public PhotoQuery withPage(int page) {
		this.page = page;
		return this;
	}
	
	public PhotoQuery withPageSize(int pageSize) {
		this.pageSize = pageSize;
		return this;
	}
	
	public PhotoQuery withWordId(long id) {
		this.wordIds.add(id);
		return this;
	}
	

	public int getPage() {
		return this.page;
	}

	public int getPageSize() {
		return this.pageSize;
	}
	
	public Privileged getOwner() {
		return owner;
	}
	
	public Privileged getViewer() {
		return viewer;
	}
	
	public String getText() {
		return text;
	}
	
	public Set<Long> getWordIds() {
		return wordIds;
	}
}
