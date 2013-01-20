package dk.in2isoft.onlineobjects.publishing;

import nu.xom.Node;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;

public abstract class DocumentBuilder {

	public DocumentBuilder() {
	}

	public abstract Node build(Document document, Privileged priviledged) throws EndUserException;

	public abstract Entity create(Privileged priviledged) throws EndUserException;

	public abstract Class<? extends Entity> getEntityType();
}
