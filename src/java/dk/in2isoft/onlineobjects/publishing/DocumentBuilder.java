package dk.in2isoft.onlineobjects.publishing;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import nu.xom.Node;

public abstract class DocumentBuilder {

	protected Document document;
	
	public DocumentBuilder(Document document) {
		this.document = document;
	}
	
	public abstract Node build() throws EndUserException;
	
	protected ModelFacade getModel() {
		return Core.getInstance().getModel();
	}
}
