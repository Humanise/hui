package dk.in2isoft.onlineobjects.apps.desktop;

import java.util.ArrayList;
import java.util.List;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class DesktopRemotingFacade extends AbstractRemotingFacade {
	
	public DesktopRemotingFacade() {
		super();
	}

	public List<SearchResult> search(String query) throws EndUserException {
		List<Entity> entities = modelService.list(new Query<Entity>(Entity.class).withWords(query));
		List<SearchResult> result = new ArrayList<SearchResult>(); 
		for (Entity element : entities) {
			result.add(new SearchResult(element.getName(),element.getClass().getCanonicalName(),element.getId()));
		}
		return result;
	}

	public List<Entity> find(String query) throws EndUserException {
		List<Entity> entities = modelService.list(new Query<Entity>(Entity.class).withWords(query).withPrivileged(getUserSession()));
		return entities;
	}
	
	public Window getEntityWindow(Long id) {
		try {
			Entity entity = modelService.get(Entity.class,id);
			return new EntityWindow(entity);
		} catch (ModelException e) {
			return null;
		}
	}
}
