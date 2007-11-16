package dk.in2isoft.onlineobjects.core;

import java.io.File;

import dk.in2isoft.onlineobjects.model.Item;

public class StorageManager {

	private File storage;
	
	protected StorageManager(File baseDir) {
		this.storage = new File(new File(baseDir,"WEB-INF"),"storage");; 
	}
	
	public File getItemFolder(Item item) {
		File items = new File(storage,"items");
		File folder = new File(items,String.valueOf(item.getId()));
		if (!folder.exists()) {
			if (!folder.mkdirs()) {
				throw new IllegalStateException("Could not create item folder!");
			}
		}
		return folder;
	}
}
