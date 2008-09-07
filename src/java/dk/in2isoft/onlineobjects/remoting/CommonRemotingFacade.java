package dk.in2isoft.onlineobjects.remoting;

import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class CommonRemotingFacade extends AbstractRemotingFacade {

	public Entity getEntity(long id) throws ModelException {
		return getModel().get(Entity.class, id);
	}
	
	public void deleteEntity(long id) throws ModelException, SecurityException {
		Entity entity = getModel().get(Entity.class, id);
		getModel().deleteEntity(entity, getUserSession());
	}
}
