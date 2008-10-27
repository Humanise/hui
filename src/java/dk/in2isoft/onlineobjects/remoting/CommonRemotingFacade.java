package dk.in2isoft.onlineobjects.remoting;

import java.util.Collection;

import com.google.common.collect.Lists;

import dk.in2isoft.in2igui.data.ItemData;
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
	
	public Collection<ItemData> getClasses() {
		Collection<Class<?>> classes = getModel().getEntityClasses();
		Collection<ItemData> items = Lists.newArrayList();
		for (Class<?> clazz : classes) {
			ItemData data = new ItemData();
			data.setValue(clazz.getCanonicalName());
			data.setTitle(clazz.getSimpleName());
			items.add(data);
		}
		return items;
	}
}
