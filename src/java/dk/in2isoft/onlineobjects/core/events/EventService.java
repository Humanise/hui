package dk.in2isoft.onlineobjects.core.events;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.model.Item;

public class EventService {

	private List<ModelEventListener> modelEventListeners = new ArrayList<ModelEventListener>();
	private static Logger log = Logger.getLogger(EventService.class);
	
	
	public EventService() {
		// TODO Auto-generated constructor stub
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
