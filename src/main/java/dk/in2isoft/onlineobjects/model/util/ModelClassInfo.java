package dk.in2isoft.onlineobjects.model.util;

import dk.in2isoft.onlineobjects.model.Item;

public class ModelClassInfo {

	private Class<Item> clazz;
	
	public ModelClassInfo(Class<Item> clazz) {
		this.clazz = clazz;
	}
	
	public Class<Item> getModelClass() {
		return clazz;
	}
	
	public String getSimpleName() {
		return clazz.getSimpleName();
	}
}
