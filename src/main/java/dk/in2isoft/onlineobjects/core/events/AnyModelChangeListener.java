package dk.in2isoft.onlineobjects.core.events;

import java.util.Collection;

import com.google.common.collect.Sets;

import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Relation;

public abstract class AnyModelChangeListener implements ModelEventListener {

	private Collection<Class<? extends Item>> types = Sets.newHashSet();
	
	public AnyModelChangeListener(Class<? extends Item>... types) {
		for (Class<? extends Item> type : types) {
			this.types.add(type);
		}
	}
	
	public void entityWasCreated(Entity entity) {
		checkEntity(entity);
	}

	private void checkEntity(Entity entity) {
		if (types.isEmpty() || types.contains(entity.getClass())) {
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
		if (types.isEmpty() || types.contains(relation.getSuperEntity().getClass())) {
			this.itemWasChanged(relation.getSuperEntity());
		}
		if (types.isEmpty() || types.contains(relation.getSubEntity().getClass())) {
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
