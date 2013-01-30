package dk.in2isoft.onlineobjects.modules.scheduling;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.modules.information.InformationService;

public class SchedulingSupportFacade {

	private InformationService informationService;
	private ModelService modelService;

	public InformationService getInformationService() {
		return informationService;
	}

	public void setInformationService(InformationService informationService) {
		this.informationService = informationService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	
}
