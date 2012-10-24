package dk.in2isoft.onlineobjects.apps.photos;

import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class PhotosRemotingFacade extends AbstractRemotingFacade {

	public void updateImageTitle(long id, String title) throws ModelException, SecurityException {
		Image image = getModelService().get(Image.class, id,getUserSession());
		image.setName(title);
		getModelService().updateItem(image, getUserSession());
	}
}
