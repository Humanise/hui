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
	
	public static final String[] TAIL_PATH = new String[] {"WEB-INF","core","web","js","tail.js"};
	private Map<String,String[]> storedScripts = new HashMap<>();
	private Map<String,String[]> storedStyles = new HashMap<>();

	private ConfigurationService configurationService;

	public String handleScripts(DependencyGraph graph) {
		String[] scripts = graph.getScripts();
		String hash = buildHash(scripts);
		storedScripts.put(hash, scripts);
		return "/service/dependency/"+configurationService.getDeploymentId()+"/"+hash+".js";
	}

	public String handleStyles(DependencyGraph graph) {
		String[] styles = graph.getStyles();
		String hash = buildHash(styles);
		storedStyles.put(hash, styles);
		return "/service/dependency/"+configurationService.getDeploymentId()+"/"+hash+".css";
	}

	private String buildHash(String[] strings) {
		StringBuilder sb = new StringBuilder();
		for (String string : strings) {
			sb.append(string);
		}
		String hash = String.valueOf(Math.abs(sb.toString().hashCode()));
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
		paths.add(TAIL_PATH);
		w.write(paths, hash);
	}

	public void respondStyles(String hash, Request request) throws ContentNotFoundException, IOException {
		String[] urls = storedStyles.get(hash);
		if (urls==null) {
			throw new ContentNotFoundException();
		}
		StylesheetWriter w = new StylesheetWriter(request, configurationService);
		List<String[]> paths = new ArrayList<>();
		for (String url : urls) {
			paths.add(url.split("\\/"));
		}
		w.write(paths, hash);
	}
	
	// Wiring...
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
}
