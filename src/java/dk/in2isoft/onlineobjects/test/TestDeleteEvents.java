package dk.in2isoft.onlineobjects.test;

import java.sql.SQLException;
import java.util.List;

import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Event;
import dk.in2isoft.onlineobjects.model.User;

public class TestDeleteEvents extends AbstractTestCase {
	
	public void test1() throws SQLException, ModelException, SecurityException {
		User publicUser = getPublicUser();
		Query<Event> query = Query.ofType(Event.class).withPaging(0, 100).withPriviledged(publicUser);
		List<Long> ids = getModel().listIds(query);
		info("Size: "+ids.size());
		int num = 0;
		for (Long id : ids) {
			Event event = getModel().get(Event.class, id);
			getModel().deleteEntity(event, publicUser);
			if (num % 10 == 0) {
				getModel().commit();
			}
			num++;
		}
		getModel().commit();
	}
}
