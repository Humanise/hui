package dk.in2isoft.onlineobjects.services;

import java.io.File;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import dk.in2isoft.onlineobjects.model.Item;

public class StorageService implements InitializingBean,ApplicationListener<ContextRefreshedEvent> {

	private static Logger log = Logger.getLogger(StorageService.class);
	
	private ConfigurationService configurationService;
	private File storage;
	private File items;

	public void onApplicationEvent(ContextRefreshedEvent event) {
		storage = new File(configurationService.getStoragePath());
		items = new File(storage,"items");
		if (!items.exists()) {
			log.warn("Items directory does not exist: "+items);
			if (!items.mkdirs()) {
				log.error("Could not create items directory: "+items);
			} else {
				log.info("Items directory created: "+items);
			}
		}
	}
	
	public void afterPropertiesSet() throws Exception {
	}
	
	public File getItemFolder(Item item) {
		return getItemFolder(item.getId());
	}
	
	public File getItemFolder(long id) {
		String idstr = String.valueOf(id);
		File subFolder = getSubFolder(idstr);
		File itemFolder = new File(subFolder,idstr);
		if (!itemFolder.exists()) {
			if (!itemFolder.mkdirs()) {
				throw new IllegalStateException("Could not create item directory in storage!");
			}
		}
		return itemFolder;
	}
	
	public File getSubFolder(String id) {
		
		String subFolderName = id.substring(0, Math.min(3, id.length()));
		subFolderName = StringUtils.leftPad(subFolderName, 3, '0');
		File folder = new File(items,subFolderName);
		if (!folder.exists()) {
			if (!folder.mkdirs()) {
				throw new IllegalStateException("Could not create item subdirectory in storage: " + folder.getAbsolutePath());
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
