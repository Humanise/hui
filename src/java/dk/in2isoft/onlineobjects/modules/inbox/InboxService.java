package dk.in2isoft.onlineobjects.modules.inbox;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;

public class InboxService {

	private static Logger log = Logger.getLogger(InboxService.class);
	
	private ModelService modelService;
	
	//private Map<Long,Integer> counts;
	
	public InboxService() {
		super();
		//counts = new HashMap<Long, Integer>();
	}

	public Pile getOrCreateInbox(User privileged) throws ModelException {
		Query<Pile> query = Query.after(Pile.class).withParent(privileged, "personal.inbox").withPrivileged(privileged);
		Pile inbox = modelService.getFirst(query);
		if (inbox==null) {
			inbox = new Pile();
			inbox.setName("Inbox for "+privileged.getUsername());
			modelService.createItem(inbox, privileged);
			modelService.grantFullPrivileges(inbox, privileged);
			modelService.createRelation(privileged, inbox, "personal.inbox", privileged);
		}
		return inbox;
	}
	
	public void add(User user, Entity entity) throws ModelException {
		if (modelService.getRelation(user, entity)==null) {
			modelService.createRelation(getOrCreateInbox(user), entity, user);
		}
	}
	
	public int getCount(User user) throws ModelException {
		// TODO Optimize this by caching id=count
		Pile inbox = getOrCreateInbox(user);
		Query<Entity> query = Query.after(Entity.class).withParent(inbox).withPrivileged(user);
		//List<Entity> list = modelService.list(query);
		return modelService.count(query).intValue();
	}
	
	public int getCountSilently(User user) {
		if (user==null) {
			log.error("The user is null, will silently rebort zero");
		}
		try {
			return getCount(user);
		} catch (ModelException e) {
			log.error("Unable to get inbox count for user="+user+", will silently rebort zero",e);
			return 0;
		}
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public boolean remove(User user, long id) throws ModelException, SecurityException {
		Pile inbox = getOrCreateInbox(user);
		Entity entity = modelService.get(Entity.class, id, user);
		Relation relation = modelService.getRelation(inbox, entity);
		if (relation==null) {
			return false;
		}
		modelService.deleteRelation(relation, user);
		return true;
	}
}
