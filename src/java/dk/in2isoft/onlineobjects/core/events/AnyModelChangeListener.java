package dk.in2isoft.onlineobjects.core.events;

import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Relation;

public abstract class AnyModelChangeListener implements ModelEventListener {

	private Class<? extends Item> type;
	
	public AnyModelChangeListener(Class<? extends Item> type) {
		this.type = type;
	}
	
	public void entityWasCreated(Entity entity) {
		checkEntity(entity);
	}

	private void checkEntity(Entity entity) {
		if (entity.getClass().equals(type)) {
			this.itemWasChanged(entity);
		}
	}

	public abstract void itemWasChanged(Item item);

	public void entityWasUpdated(Entity entity) {
		checkEntity(entity);
	}

	public void entityWasDeleted(Entity entity) {
		checkEntity(entity);
	}

	public void relationWasCreated(Relation relation) {
		checkRelation(relation);
	}

	private void checkRelation(Relation relation) {
		if (relation.getSuperEntity().getClass().equals(type)) {
			this.itemWasChanged(relation.getSuperEntity());
		}
		if (relation.getSubEntity().getClass().equals(type)) {
			this.itemWasChanged(relation.getSubEntity());
		}
	}

	public void relationWasUpdated(Relation relation) {
		checkRelation(relation);
	}

	public void relationWasDeleted(Relation relation) {
		checkRelation(relation);
	}

}
