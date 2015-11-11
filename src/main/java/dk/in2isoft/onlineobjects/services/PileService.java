package dk.in2isoft.onlineobjects.services;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class PileService {

	private ModelService modelService;
	
	public Pile getOrCreateGlobalPile(String key, Privileged privileged) throws ModelException {
		Query<Pile> query = Query.after(Pile.class).withCustomProperty(Pile.PROPERTY_KEY, key);
		Pile first = modelService.search(query).getFirst();
		if (first==null) {
			first = new Pile();
			first.addProperty(Pile.PROPERTY_KEY, key);
			first.setName(key);
			modelService.createItem(first, privileged);
		}
		return first;
	}
	
	public Pile getOrCreatePileByKey(String key, User user) throws ModelException {
		Query<Pile> query = Query.after(Pile.class).withCustomProperty(Pile.PROPERTY_KEY, key).from(user);
		Pile first = modelService.search(query).getFirst();
		if (first==null) {
			first = new Pile();
			first.addProperty(Pile.PROPERTY_KEY, key);
			first.setName(key);
			modelService.createItem(first, user);
			modelService.createRelation(user, first, user);
		}
		return first;
	}

	public Pile getOrCreatePileByRelation(User user, String relationKind) throws ModelException {
		Query<Pile> query = Query.after(Pile.class).from(user, relationKind).withPrivileged(user);
		Pile pile = modelService.getFirst(query);
		if (pile==null) {
			pile = new Pile();
			pile.setName(relationKind + " for "+user.getUsername());
			modelService.createItem(pile, user);
			modelService.grantFullPrivileges(pile, user);
			modelService.createRelation(user, pile, relationKind, user);
		}
		return pile;
	}

	public void addOrRemoveFromPile(User user, String relationKind, Entity enity, boolean add) throws ModelException, SecurityException {
		Pile favorites = this.getOrCreatePileByRelation(user, relationKind);
		Relation relation = modelService.getRelation(favorites, enity);
		if (add && relation==null) {
			modelService.createRelation(favorites, enity, user);
		} else if (!add && relation!=null) {
			modelService.deleteRelation(relation, user);
		}
		
	}
	
	// Wiring...

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
