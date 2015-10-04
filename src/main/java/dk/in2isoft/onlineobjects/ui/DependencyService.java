package dk.in2isoft.onlineobjects.ui;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dk.in2isoft.commons.jsf.DependencyGraph;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class DependencyService {
	
	private Map<String,String[]> storedScripts = new HashMap<>();
	private ConfigurationService configurationService;

	public String handleScripts(DependencyGraph graph) {
		String[] scripts = graph.getScripts();
		StringBuilder sb = new StringBuilder();
		for (String string : scripts) {
			sb.append(string);
		}
		
		String hash = String.valueOf(Math.abs(sb.toString().hashCode()));
		storedScripts.put(hash, scripts);
		return hash;
	}

	public void respondScripts(String hash, Request request) throws ContentNotFoundException, IOException {
		String[] urls = storedScripts.get(hash);
		if (urls==null) {
			throw new ContentNotFoundException();
		}
		ScriptWriter w = new ScriptWriter(request, configurationService);
		List<String[]> paths = new ArrayList<>();
		for (String url : urls) {
			paths.add(url.split("\\/"));
		}
		w.write(paths, hash);
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
}
