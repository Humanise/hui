package dk.in2isoft.onlineobjects.ui.resources;

import java.util.List;
import java.util.Map;

public class BlendInfo {
	private Map<String, List<String>> all;
	private Map<String, List<String>> loggedIn;

	public Map<String, List<String>> getAll() {
		return all;
	}

	public void setAll(Map<String, List<String>> all) {
		this.all = all;
	}

	public Map<String, List<String>> getLoggedIn() {
		return loggedIn;
	}

	public void setLoggedIn(Map<String, List<String>> loggedIn) {
		this.loggedIn = loggedIn;
	}
}
