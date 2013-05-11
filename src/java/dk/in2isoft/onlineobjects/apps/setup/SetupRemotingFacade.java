package dk.in2isoft.onlineobjects.apps.setup;

import java.lang.reflect.Method;
import java.util.List;

import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Application;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class SetupRemotingFacade extends AbstractRemotingFacade {
	
	private ImageService imageService;
	private FileService fileService;
	
	@Override
	public boolean isAccessAllowed(Method method) throws SecurityException {
		String username = getUserSession().getUser().getUsername();
		if (!SecurityService.ADMIN_USERNAME.equals(username)) {
			throw new SecurityException("This tool can only be accessed by the administrator");
		}
		return true;
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
}
