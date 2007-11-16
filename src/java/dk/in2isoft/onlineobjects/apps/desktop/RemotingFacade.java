package dk.in2isoft.onlineobjects.apps.desktop;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.ModelQuery;
import dk.in2isoft.onlineobjects.model.Entity;

public class RemotingFacade {

	//private static Logger log = Logger.getLogger(RemotingFacade.class);
	
	public RemotingFacade() {
		super();
	}

	public List<SearchResult> search(String query) {
		ModelQuery mq = new ModelQuery();
		mq.setWords(query.split(" "));
		List<Entity> entities = Core.getInstance().getModel().searchEntities(mq);
		List<SearchResult> result = new ArrayList<SearchResult>(); 
		for (Iterator<Entity> iter = entities.iterator(); iter.hasNext();) {
			Entity element = iter.next();
			result.add(new SearchResult(element.getName(),element.getClass().getCanonicalName(),element.getId()));
		}
		return result;
	}
	
	public Window getEntityWindow(Long id) {
		try {
			ModelFacade model = Core.getInstance().getModel();
			Entity entity = model.loadEntity(Entity.class,id);
			return new EntityWindow(entity);
		} catch (ModelException e) {
			return null;
		}
	}
}
