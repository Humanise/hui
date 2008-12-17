package dk.in2isoft.onlineobjects.core;

import java.io.File;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.model.Item;

public class StorageManager {

	private static Logger log = Logger.getLogger(StorageManager.class);
	
	private File storage;
	private File items;
	
	protected StorageManager(File dir) throws ConfigurationException {
		storage = dir;
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
}
