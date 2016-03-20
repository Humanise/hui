package dk.in2isoft.onlineobjects.core.events;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class EventService {

	private List<ModelEventListener> modelEventListeners = new CopyOnWriteArrayList<ModelEventListener>();
	private static Logger log = Logger.getLogger(EventService.class);
	
	
	public EventService() {
	}
	
	public void setModelEventListeners(List<ModelEventListener> modelEventListeners) {
		this.modelEventListeners.addAll(modelEventListeners);
	}
	
	public void addModelEventListener(ModelEventListener listener) {
		this.modelEventListeners.add(listener);
	}
	
	public void fireItemWasCreated(Item item) {
		log.info("Item was created: "+item);
		for (ModelEventListener listener : modelEventListeners) {
			if (item instanceof Entity) {
				listener.entityWasCreated((Entity) item);
			}
			if (item instanceof Relation) {
				listener.relationWasCreated((Relation) item);
			}
		}
	}
	
	public void fireItemWasUpdated(Item item) {
		log.info("Item was updated: "+item);
		for (ModelEventListener listener : modelEventListeners) {
			if (item instanceof Entity) {
				listener.entityWasUpdated((Entity) item);
			}
			if (item instanceof Relation) {
				listener.relationWasUpdated((Relation) item);
			}
		}
	}

	public void fireItemWasDeleted(Item item) {
		log.info("Item was deleted: "+item);
		for (ModelEventListener listener : modelEventListeners) {
			if (item instanceof Entity) {
				listener.entityWasDeleted((Entity) item);
			}
			if (item instanceof Relation) {
				listener.relationWasDeleted((Relation) item);
			}
		}
	}

	public void firePrivilegesRemoved(Item item, List<User> users) {
		for (ModelEventListener listener : modelEventListeners) {
			if (listener instanceof ModelPrivilegesEventListener) {
				((ModelPrivilegesEventListener) listener).allPrivilegesWasRemoved(item, users);
			}
		}
	}
}
