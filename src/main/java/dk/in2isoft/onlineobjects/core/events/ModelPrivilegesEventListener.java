package dk.in2isoft.onlineobjects.core.events;

import java.util.List;

import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.User;

public interface ModelPrivilegesEventListener extends ModelEventListener {

	public void allPrivilegesWasRemoved(Item item, List<User> users);
}
