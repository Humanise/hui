package dk.in2isoft.onlineobjects.publishing;

import nu.xom.Node;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.model.Entity;

public abstract class DocumentBuilder {

	public DocumentBuilder() {
	}

	public abstract Node build(Document document) throws EndUserException;

	protected ModelService getModel() {
		return Core.getInstance().getModel();
	}

	public abstract Entity create(Priviledged priviledged) throws EndUserException;

	public static DocumentBuilder getBuilder(Class<?> clazz) throws EndUserException {

		String className = "dk.in2isoft.onlineobjects.publishing." + clazz.getSimpleName() + "Builder";
		try {
			Class<?> converterClass = Class.forName(className);
			DocumentBuilder entityConverter = (DocumentBuilder) converterClass.newInstance();
			return entityConverter;
		} catch (ClassNotFoundException e) {
			throw new EndUserException(e);
		} catch (InstantiationException e) {
			throw new EndUserException(e);
		} catch (IllegalAccessException e) {
			throw new EndUserException(e);
		}
	}
}
