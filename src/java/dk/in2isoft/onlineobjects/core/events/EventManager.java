package dk.in2isoft.onlineobjects.core.events;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.model.Item;

public class EventManager {

	private static EventManager instance;
	private List<ModelEventListener> modelEventListeners = new ArrayList<ModelEventListener>();
	private static Logger log = Logger.getLogger(EventManager.class);
	
	
	public EventManager() {
		// TODO Auto-generated constructor stub
	}

	public static EventManager getInstance() {
		if (instance == null) {
			instance = new EventManager();
		}
		return instance;
	}
	
	public void addModelEventListener(ModelEventListener listener) {
		this.modelEventListeners.add(listener);
	}
	
	public void fireItemWasCreated(Item item) {
		log.info("Item was created: "+item);
		for (ModelEventListener listener : modelEventListeners) {
			listener.itemWasCreated(item);
		}
	}
	
	public void fireItemWasUpdated(Item item) {
		log.info("Item was updated: "+item);
		for (ModelEventListener listener : modelEventListeners) {
			listener.itemWasUpdated(item);
		}
	}

	public void fireItemWasDeleted(Item item) {
		log.info("Item was deleted: "+item);
		for (ModelEventListener listener : modelEventListeners) {
			listener.itemWasDeleted(item);
		}
	}
}
