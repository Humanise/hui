package dk.in2isoft.onlineobjects.service.model;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.services.ConversionService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ModelControllerBase extends ServiceController {

	protected ImageService imageService;
	protected ModelService modelService;
	protected ConversionService conversionService;
	protected LanguageService languageService;

	public ModelControllerBase() {
		super("model");
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public ImageService getImageService() {
		return imageService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setConversionService(ConversionService conversionService) {
		this.conversionService = conversionService;
	}

	public ConversionService getConversionService() {
		return conversionService;
	}

	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
}
