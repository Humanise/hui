package dk.in2isoft.onlineobjects.test;

import java.util.List;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Event;

public class TestClearEvents extends AbstractTestCase {
	
	public void test() throws ModelException, SecurityException {

		Priviledged publicUser = Core.getInstance().getModel().getUser("public");
		
		List<Event> events = getModel().search(new Query<Event>(Event.class).withCustomProperty("sync.remote.source", "EASY"));
		for (Event event : events) {
			getModel().deleteEntity(event, publicUser);
		}
	}
}
