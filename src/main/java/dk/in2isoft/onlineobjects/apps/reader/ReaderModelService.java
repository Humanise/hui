package dk.in2isoft.onlineobjects.apps.reader;

import java.util.List;

import dk.in2isoft.onlineobjects.apps.reader.perspective.CategorizableViewPerspective;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.services.PileService;

public class ReaderModelService {

	private ModelService modelService;
	private PileService pileService;

	public void categorize(Entity entity, CategorizableViewPerspective perspective, UserSession session) throws ModelException {
		Pile inbox = pileService.getOrCreatePileByRelation(session.getUser(), Relation.KIND_SYSTEM_USER_INBOX);
		Pile favorites = pileService.getOrCreatePileByRelation(session.getUser(), Relation.KIND_SYSTEM_USER_FAVORITES);

		List<Pile> piles = modelService.getParents(entity, Pile.class, session);
		for (Pile pile : piles) {
			if (pile.getId() == inbox.getId()) {
				perspective.setInbox(true);
			} else if (pile.getId() == favorites.getId()) {
				perspective.setFavorite(true);
			}
		}
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setPileService(PileService pileService) {
		this.pileService = pileService;
	}
}
