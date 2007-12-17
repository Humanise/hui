package dk.in2isoft.onlineobjects.core;

public abstract class AbstractDAO {

	public AbstractDAO() {
		super();
	}

	protected ModelFacade getModel() {
		return Core.getInstance().getModel();
	}
}