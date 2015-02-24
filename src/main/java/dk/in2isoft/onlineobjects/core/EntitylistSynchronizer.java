package dk.in2isoft.onlineobjects.core;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dk.in2isoft.onlineobjects.model.Entity;

public class EntitylistSynchronizer<T extends Entity> {

	private List<T> originals = null;
	private List<T> dummies;
	
	public EntitylistSynchronizer (List<T> originals, List<T> dummies) {
		this.originals = originals;
		this.dummies = dummies;
	}
	
	public List<T> getNew() {
		List<T> list = new ArrayList<T>();
		for (T entity : dummies) {
			if (entity.isNew()) {
				list.add(entity);
			}
		}
		return list;
	}
	
	public List<T> getDeleted() {
		List<T> list = new ArrayList<T>();
		for (T original : originals) {
			boolean found = false;
			for (T dummy : dummies) {
				if (original.getId()==dummy.getId()) {
					found = true;
				}
			}
			if (!found) {
				list.add(original);
			}
		}
		return list;
	}
	
	public Map<T,T> getUpdated() {
		Map<T,T> list = new HashMap<T,T>();
		for (T original : originals) {
			for (T dummy : dummies) {
				if (original.getId()==dummy.getId()) {
					list.put(original, dummy);
				}
			}
		}
		return list;
	}
}
