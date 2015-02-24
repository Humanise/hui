package dk.in2isoft.onlineobjects.core.events;

import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Relation;

public interface ModelEventListener {

	public void entityWasCreated(Entity entity);

	public void entityWasUpdated(Entity entity);

	public void entityWasDeleted(Entity entity);
	
	public void relationWasCreated(Relation relation);

	public void relationWasUpdated(Relation relation);

	public void relationWasDeleted(Relation relation);
}
