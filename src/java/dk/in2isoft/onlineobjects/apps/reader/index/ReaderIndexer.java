package dk.in2isoft.onlineobjects.apps.reader.index;

import java.util.List;

import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.events.ModelEventListener;
import dk.in2isoft.onlineobjects.core.events.ModelPrivilegesEventListener;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexService;

public class ReaderIndexer implements ModelEventListener, ModelPrivilegesEventListener {
		
	private ReaderIndexDocumentBuilder documentBuilder;
	
	private IndexService indexService;
	
	private ModelService modelService;
	
	private static final Logger log = Logger.getLogger(ReaderIndexer.class);
	
	public void entityWasCreated(Entity entity) {
		if (entity instanceof InternetAddress) {
			index((InternetAddress) entity);
		}
	}
	
	public void clear(Privileged privileged) throws EndUserException {
		getIndexManager(privileged).clear();
	}
	
	public void index(InternetAddress address) {
		try {
			User owner = modelService.getOwner(address);
			if (owner!=null) {
				Document document = documentBuilder.build(address);
				log.debug("Re-indexing : "+address);
				getIndexManager(owner).update(address, document);
			}
		} catch (EndUserException e) {
			log.error("Unable to reindex: "+address, e);
		}
	}
	
	private IndexManager getIndexManager(Privileged privileged) {
		return indexService.getIndex("app-reader-user-"+privileged.getIdentity());
	}

	public void entityWasUpdated(Entity entity) {
		if (entity instanceof InternetAddress) {
			index((InternetAddress) entity);
		}		
	}

	public void entityWasDeleted(Entity entity) {
		// see: allPrivilegesWasRemoved
	}
	
	@Override
	public void allPrivilegesWasRemoved(Item item, List<User> users) {
		if (item instanceof InternetAddress) {
			for (User user : users) {
				try {
					getIndexManager(user).delete(item.getId());
				} catch (EndUserException e) {
					log.error("Unable to remove: "+item, e);
				}
			}
		}
	}

	public void relationWasCreated(Relation relation) {
		if (relation.getSuperEntity() instanceof InternetAddress) {
			index((InternetAddress) relation.getSuperEntity());
		}
		if (relation.getSubEntity() instanceof InternetAddress) {
			index((InternetAddress) relation.getSubEntity());
		}
	}

	public void relationWasUpdated(Relation relation) {
		if (relation.getSuperEntity() instanceof InternetAddress) {
			index((InternetAddress) relation.getSuperEntity());
		}
		if (relation.getSubEntity() instanceof InternetAddress) {
			index((InternetAddress) relation.getSubEntity());
		}
	}

	public void relationWasDeleted(Relation relation) {
		if (relation.getSuperEntity() instanceof InternetAddress) {
			index((InternetAddress) relation.getSuperEntity());
		}
		if (relation.getSubEntity() instanceof InternetAddress) {
			index((InternetAddress) relation.getSubEntity());
		}
	}

	// Wiring...
	
	public void setDocumentBuilder(ReaderIndexDocumentBuilder documentBuilder) {
		this.documentBuilder = documentBuilder;
	}
	
	public void setIndexService(IndexService indexService) {
		this.indexService = indexService;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
