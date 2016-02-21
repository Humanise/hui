package dk.in2isoft.onlineobjects.service.model;

import dk.in2isoft.onlineobjects.apps.community.services.MemberService;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.modules.inbox.InboxService;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.services.ConversionService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.PersonService;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ModelControllerBase extends ServiceController {

	protected ImageService imageService;
	protected ModelService modelService;
	protected ConversionService conversionService;
	protected LanguageService languageService;
	protected MemberService memberService;
	protected SecurityService securityService;
	protected InboxService inboxService;
	protected WordService wordService;
	protected PersonService personService; 

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
	
	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setInboxService(InboxService inboxService) {
		this.inboxService = inboxService;
	}
	
	public void setWordService(WordService wordService) {
		this.wordService = wordService;
	}
	
	public void setPersonService(PersonService personService) {
		this.personService = personService;
	}
}
