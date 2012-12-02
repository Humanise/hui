package dk.in2isoft.onlineobjects.services;

import java.io.File;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.exceptions.ConfigurationException;
import dk.in2isoft.onlineobjects.model.Item;

public class StorageService implements org.springframework.beans.factory.InitializingBean {

	private static Logger log = Logger.getLogger(StorageService.class);
	
	private ConfigurationService configurationService;
	private File storage;
	private File items;

	public void afterPropertiesSet() throws Exception {
		storage = new File(configurationService.getStoragePath());
		items = new File(storage,"items");
		if (!items.exists()) {
			log.warn("Items directory does not exist: "+items);
			if (!items.mkdirs()) {
				throw new ConfigurationException("Could not create items directory: "+items);
			}
			log.info("Items directory created: "+items);
		}
	}
	
	public File getItemFolder(Item item) {
		return getItemFolder(item.getId());
	}
	
	public File getItemFolder(long id) {
		File folder = new File(items,String.valueOf(id));
		if (!folder.exists()) {
			if (!folder.mkdirs()) {
				throw new IllegalStateException("Could not create items diractory in storage!");
			}
		}
		return folder;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}
}
