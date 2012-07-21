package dk.in2isoft.onlineobjects.services;

import dk.in2isoft.onlineobjects.modules.index.IndexManager;

public class IndexService {
	
	private ConfigurationService configurationService;
	private String directoryName = "index";

	
	public IndexManager getIndex(String name) {
		IndexManager indexManager = new IndexManager(name);
		indexManager.setConfigurationService(configurationService);
		return indexManager;
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

}
