package dk.in2isoft.onlineobjects.modules.scheduling;

import java.util.Collection;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.modules.index.ConfigurableIndexer;
import dk.in2isoft.onlineobjects.modules.index.WordIndexer;
import dk.in2isoft.onlineobjects.modules.information.InformationService;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.modules.onlinepublisher.OnlinePublisherService;
import dk.in2isoft.onlineobjects.modules.surveillance.SurveillanceService;
import dk.in2isoft.onlineobjects.modules.synchronization.MailWatchingService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class SchedulingSupportFacade {

	private InformationService informationService;
	private ModelService modelService;
	private FileService fileService;
	private ImageService imageService;
	private MailWatchingService mailWatchingService;
	private SurveillanceService surveillanceService;
	private WordIndexer wordIndexer;
	private SchedulingService schedulingService;
	private OnlinePublisherService onlinePublisherService;
	private SecurityService securityService;
	private WordService wordService;
	private Collection<ConfigurableIndexer<? extends Entity>> configurableIndexers;
	private LanguageService languageService;

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

	public FileService getFileService() {
		return fileService;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public ImageService getImageService() {
		return imageService;
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public MailWatchingService getMailWatchingService() {
		return mailWatchingService;
	}

	public void setMailWatchingService(MailWatchingService mailWatchingService) {
		this.mailWatchingService = mailWatchingService;
	}

	public SurveillanceService getSurveillanceService() {
		return surveillanceService;
	}

	public void setSurveillanceService(SurveillanceService surveillanceService) {
		this.surveillanceService = surveillanceService;
	}

	public WordIndexer getWordIndexer() {
		return wordIndexer;
	}

	public void setWordIndexer(WordIndexer wordIndexer) {
		this.wordIndexer = wordIndexer;
	}
	
	public void setSchedulingService(SchedulingService schedulingService) {
		this.schedulingService = schedulingService;
	}
	
	public SchedulingService getSchedulingService() {
		return schedulingService;
	}

	public OnlinePublisherService getOnlinePublisherService() {
		return onlinePublisherService;
	}

	public void setOnlinePublisherService(OnlinePublisherService onlinePublisherService) {
		this.onlinePublisherService = onlinePublisherService;
	}
	
	public <E extends Entity> ConfigurableIndexer<E> getConfigurableIndexer(Class<E> type) {
		for (ConfigurableIndexer<? extends Entity> indexer : configurableIndexers) {
			if (type.equals(indexer.getType())) {
				return (ConfigurableIndexer<E>) indexer;
			}
		}
		return null;
	}
	
	public void setConfigurableIndexers(Collection<ConfigurableIndexer<? extends Entity>> configurableIndexers) {
		this.configurableIndexers = configurableIndexers;
	}
	
	public void setWordService(WordService wordService) {
		this.wordService = wordService;
	}
	
	public WordService getWordService() {
		return wordService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public LanguageService getLanguageService() {
		return this.languageService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
}
