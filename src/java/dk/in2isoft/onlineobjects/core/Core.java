package dk.in2isoft.onlineobjects.core;

import java.io.File;
import java.util.List;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.model.Application;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.ApplicationService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.ConversionService;
import dk.in2isoft.onlineobjects.services.StorageService;

public class Core {

	private static Logger log = Logger.getLogger(Core.class);

	private static Core instance;

	private File baseDir;

	private ServletContext context;

	private Configuration config;

	private ModelService model;

	private ConversionService converter;

	private Scheduler scheduler;

	private Priviledged superUser = new SuperUser();

	private boolean started;

	private Core() {
		scheduler = new Scheduler();
	}

	private void setupConfiguration() throws ConfigurationException {
		this.config = new Configuration(baseDir);
	}

	public static Core getInstance() {
		if (instance == null) {
			instance = new Core();
		}
		return instance;
	}

	public void start(String basePath, ServletContext context) throws ConfigurationException, ModelException {
		if (started) {
			throw new IllegalStateException("System allready started!");
		}
		File dir = new File(basePath);
		if (!dir.exists()) {
			throw new IllegalStateException("Invalid base path provided");
		} else {
			log.info("OnlineObjects started at basePath: " + basePath);
			this.baseDir = dir;
			this.context = context;
		}
		setupConfiguration();
		ensureUsers();
		ensureApplications();
		started = true;
		log.info("OnlineObjects started successfully!");
	}

	public Configuration getConfiguration() {
		return config;
	}

	public ApplicationService getApplicationService() {
		return getBean(ApplicationService.class);
	}

	public ServletContext getServletContext() {
		return context;
	}

	@SuppressWarnings("unchecked")
	public <T> T getBean(Class<T> beanClass) {
		String name = beanClass.getSimpleName().substring(0, 1).toLowerCase()+beanClass.getSimpleName().substring(1);
		WebApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(context);
		return (T) applicationContext.getBean(name, beanClass);
	}

	public ModelService getModel() {
		if (model == null) {
			model = getBean(ModelService.class);
		}
		return model;
	}

	public SecurityService getSecurityService() {
		return getBean(SecurityService.class);
	}

	public EventService getEventService() {
		return getBean(EventService.class);
	}

	public ConversionService getConversionService() {
		if (converter == null) {
			converter = getBean(ConversionService.class);
		}
		return converter;
	}

	public StorageService getStorageService() {
		return getBean(StorageService.class);
	}

	public Scheduler getScheduler() {
		return scheduler;
	}

	private void ensureUsers() throws ModelException {
		User publicUser = getModel().getUser(SecurityService.PUBLIC_USERNAME);
		if (publicUser == null) {
			log.warn("No public user present!");
			User user = new User();
			user.setUsername(SecurityService.PUBLIC_USERNAME);
			user.setName("Public user");
			getModel().createItem(user, superUser);
			getModel().commit();
			log.info("Public user created!");
		}
		User adminUser = getModel().getUser(SecurityService.ADMIN_USERNAME);
		if (adminUser == null) {
			log.warn("No admin user present!");
			User user = new User();
			user.setUsername(SecurityService.ADMIN_USERNAME);
			user.setPassword("changeme");
			user.setName("Administrator");
			getModel().createItem(user, superUser);
			getModel().commit();
			log.info("Administrator created!");
		}
	}

	private void ensureApplications() throws ModelException {
		ApplicationService applicationService = getApplicationService();
		Query<Application> query = Query.of(Application.class);
		List<Application> apps = getModel().list(query);
		applicationService.registerApplications(apps);
		boolean found = false;
		for (Application application : apps) {
			if ("setup".equals(application.getName())) {
				found = true;
			}
		}
		if (!found) {
			log.warn("No setup application present!");
			Application setup = new Application();
			setup.setName("setup");
			User adminUser = getModel().getUser(SecurityService.ADMIN_USERNAME);
			getModel().createItem(setup, adminUser);
			getModel().commit();
			applicationService.registerApplication(setup);
			log.info("Created setup application");
		}
	}

	private class SuperUser implements Priviledged {
		public long getIdentity() {
			return -1;
		}

		public boolean isSuper() {
			return true;
		}
	}

	public boolean isStarted() {
		return started;
	}

	public ConfigurationService getConfigurationService() {
		return getBean(ConfigurationService.class);
	}
}
