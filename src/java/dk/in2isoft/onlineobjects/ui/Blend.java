package dk.in2isoft.onlineobjects.ui;

import java.util.List;

import com.google.common.collect.Lists;

public class Blend {

	private List<String[]> paths = Lists.newArrayList();
	
	private String hash;
	
	public Blend(String hash) {
		this.hash = hash;
	}
	
	public void addPath(String...path) {
		paths.add(path);
	}
	
	public List<String[]> getPaths() {
		return paths;
	}
	
	public String getHash() {
		return hash;
	}
}
