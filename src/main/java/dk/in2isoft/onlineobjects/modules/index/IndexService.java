package dk.in2isoft.onlineobjects.modules.index;

import java.util.List;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class IndexService {
	
	private ConfigurationService configurationService;
	private String directoryName = "index";

	public static String WORDS_INDEX = "app-words-general";
	public static String PHOTOS_INDEX = "app-photos-general";
	
	private List<IndexManager> managers = Lists.newArrayList();
	
	public IndexManager getIndex(String name) {
		if (Strings.isBlank(name)) {
			return null;
		}
		for (IndexManager manager : managers) {
			if (name.equals(manager.getDirectoryName())) {
				return manager;
			}
		}
		IndexManager indexManager = new IndexManager(name);
		indexManager.setConfigurationService(configurationService);
		return indexManager;
	}
	
	public IndexManager getIndex(User user) {
		String name = "user_"+user.getId();
		return getIndex(name);
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

	public void setDirectoryName(String directoryName) {
		this.directoryName = directoryName;
	}

	public String getDirectoryName() {
		return directoryName;
	}
	
	public void setManagers(List<IndexManager> managers) {
		this.managers = managers;
	}

	public List<String> getIndexNames() {
		List<String> names = Lists.newArrayList();
		for (IndexManager manager : managers) {
			names.add(manager.getDirectoryName());
		}
		return names;
	}

}
