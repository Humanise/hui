package dk.in2isoft.onlineobjects.apps.desktop;

import java.util.ArrayList;
import java.util.List;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class RemotingFacade extends AbstractRemotingFacade {
	
	public RemotingFacade() {
		super();
	}

	public List<SearchResult> search(String query) throws EndUserException {
		List<Entity> entities = getModel().list(new Query<Entity>(Entity.class).withWords(query));
		List<SearchResult> result = new ArrayList<SearchResult>(); 
		for (Entity element : entities) {
			result.add(new SearchResult(element.getName(),element.getClass().getCanonicalName(),element.getId()));
		}
		return result;
	}
	
	public Window getEntityWindow(Long id) {
		try {
			ModelFacade model = Core.getInstance().getModel();
			Entity entity = model.get(Entity.class,id);
			return new EntityWindow(entity);
		} catch (ModelException e) {
			return null;
		}
	}
}
