package dk.in2isoft.onlineobjects.services;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Pile;

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
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
