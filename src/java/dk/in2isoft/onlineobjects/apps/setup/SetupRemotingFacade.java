package dk.in2isoft.onlineobjects.apps.setup;

import java.lang.reflect.Method;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.SortedSet;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.ListObjects;
import dk.in2isoft.in2igui.data.ListState;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Application;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.localization.LocalizationService;
import dk.in2isoft.onlineobjects.modules.scheduling.SchedulingService;
import dk.in2isoft.onlineobjects.modules.surveillance.RequestInfo;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.SurveillanceService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class SetupRemotingFacade extends AbstractRemotingFacade {
	
	private ImageService imageService;
	private FileService fileService;
	private SchedulingService schedulingService;
	private SecurityService securityService;
	private SurveillanceService surveillanceService;
	private LocalizationService localizationService;
	
	@Override
	public boolean isAccessAllowed(Method method) throws SecurityException {
		String username = getUserSession().getUser().getUsername();
		if (!SecurityService.ADMIN_USERNAME.equals(username)) {
			throw new SecurityException("This tool can only be accessed by the administrator");
		}
		return true;
	}
	
	public void synchronizeImageMetaData() throws EndUserException {
		UserSession userSession = getUserSession();
		List<Image> list = modelService.list(Query.of(Image.class));
		for (Image image : list) {
			String name = image.getName();
			if (name!=null && name.toLowerCase().endsWith(".jpg")) {
				image.setName(fileService.cleanFileName(name));
				modelService.updateItem(image, userSession);
			}
			imageService.synchronizeContentType(image, userSession);
			imageService.synchronizeMetaData(image,userSession);
		}
	}
	
	public ListData getApplicationList() {
		ListData data = new ListData();
		List<Application> list = modelService.list(Query.of(Application.class).orderByName());
		data.addHeader("Name");
		data.addHeader("Domain");
		for (Application application : list) {
			data.newRow(application.getId(),"application");
			data.addCell(application.getName());
			data.addCell(application.getPropertyValue("domain"));
		}
		return data;
	}
	
	public ApplicationInfo getApplication(long id) throws ModelException {
		Application application = modelService.get(Application.class, id,getRequest().getSession().getUser());
		ApplicationInfo info = new ApplicationInfo();
		info.setName(application.getName());
		info.setId(application.getId());
		info.setDomain(application.getPropertyValue("domain"));
		return info;
	}
	
	public void deleteApplication(long id) throws ModelException, SecurityException {
		Application application = modelService.get(Application.class, id,getRequest().getSession().getUser());
		modelService.deleteEntity(application, getUserSession());
	}
	
	public void saveApplication(ApplicationInfo info) throws ModelException, SecurityException {
		if (info.getId()==null || info.getId()==0) {
			Application application = new Application();
			application.setName(info.getName());
			application.overrideFirstProperty("domain", info.getDomain());
			modelService.createItem(application, getUserSession());
		} else {
			Application application = modelService.get(Application.class, info.getId(), getRequest().getSession());
			application.setName(info.getName());
			application.overrideFirstProperty("domain", info.getDomain());
			modelService.updateItem(application, getUserSession());
		}
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public void setSchedulingService(SchedulingService schedulingService) {
		this.schedulingService = schedulingService;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public void setSurveillanceService(SurveillanceService surveillanceService) {
		this.surveillanceService = surveillanceService;
	}
	
	public void setLocalizationService(LocalizationService localizationService) {
		this.localizationService = localizationService;
	}
}
