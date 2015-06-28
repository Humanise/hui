package dk.in2isoft.onlineobjects.modules.photos;

import java.util.Set;

import com.google.common.collect.Sets;

import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.modules.index.IndexQuery;

public class PhotoIndexQuery extends IndexQuery {

	private Privileged owner;
	private Privileged viewer;
	private Set<Long> wordIds = Sets.newHashSet();
	
	public PhotoIndexQuery withOwner(Privileged privileged) {
		this.owner = privileged;
		return this;
	}
	
	public PhotoIndexQuery withViewer(Privileged privileged) {
		this.viewer = privileged;
		return this;
	}
	
	public PhotoIndexQuery withPage(int page) {
		this.page = page;
		return this;
	}
	
	public PhotoIndexQuery withPageSize(int pageSize) {
		this.pageSize = pageSize;
		return this;
	}
	
	public PhotoIndexQuery withWordId(long id) {
		this.wordIds.add(id);
		return this;
	}

	public PhotoIndexQuery withText(String text) {
		this.text = text;
		return this;
	}
	

	public Privileged getOwner() {
		return owner;
	}
	
	public Privileged getViewer() {
		return viewer;
	}
	
	public Set<Long> getWordIds() {
		return wordIds;
	}
}
