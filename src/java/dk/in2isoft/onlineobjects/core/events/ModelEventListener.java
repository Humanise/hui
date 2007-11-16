package dk.in2isoft.onlineobjects.core.events;

import dk.in2isoft.onlineobjects.model.Item;

public interface ModelEventListener {

	public void itemWasCreated(Item item);

	public void itemWasUpdated(Item item);
	
}
