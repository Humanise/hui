package dk.in2isoft.onlineobjects.services;

import java.io.File;
import java.util.Collection;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.transform.TransformerFactory;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.exceptions.ConfigurationException;
import dk.in2isoft.onlineobjects.ui.Request;

public class ConfigurationService implements InitializingBean {
	
	private static Logger log = Logger.getLogger(ConfigurationService.class);
	
	private String baseUrl;
	private String basePath;
	private String storagePath;
	private boolean developmentMode;
	private String imageMagickPath;
	private String graphvizPath;
	private String developmentUser;
	private String analyticsCode;
	private String rootDomain;
	
	private File tempDir;

	private File storageDir;

	private File indexDir;
	
	private Multimap<String, Locale> appLocales = HashMultimap.create();
	
	private LifeCycleService lifeCycleService;


	public void afterPropertiesSet() throws Exception {
		storageDir = new File(storagePath);
		if (storageDir.canWrite()) {
			log.info("Storage can be written");
		} else {
			throw new ConfigurationException("Unable to write to storage directory on path: "+storageDir);
		}
		tempDir = new File(storageDir,"temporary");
		if (!tempDir.isDirectory()) {
			if (!tempDir.mkdir()) {
				throw new ConfigurationException("Could not create temporary directory");
			}
			log.info("Created temporary directory");
		} else if (!tempDir.canWrite()) {
			throw new ConfigurationException("Can not write to the temporary directory");
		}

		indexDir = new File(storageDir,"index");
		if (!indexDir.isDirectory()) {
			if (!indexDir.mkdir()) {
				throw new ConfigurationException("Could not create index directory");
			}
			log.info("Created index directory");
		} else if (!indexDir.canWrite()) {
			throw new ConfigurationException("Can not write to the index directory");
		}
		testSetup();		
	}
	
	@Autowired
	public void setApplicationControllers(Collection<? extends ApplicationController> controllers) {
		for (ApplicationController controller : controllers) {
			if (controller.getLocales()!=null) {
				appLocales.putAll(controller.getName(), controller.getLocales());
			}
		}
	}
	
	public void testSetup() {
		log.info("Document builder factory: "+DocumentBuilderFactory.newInstance().getClass().getName());
		log.info("Transformer factory: "+TransformerFactory.newInstance().getClass().getName());
		log.info("SAX parser factory: "+SAXParserFactory.newInstance().getClass().getName());
	}
	
	public File getTempDir() {
		return tempDir;
	}
	
	public File getFile(String... path) {
		StringBuilder name = new StringBuilder();
		name.append(basePath);
		for (int i = 0; i < path.length; i++) {
			name.append(File.separatorChar);
			name.append(path[i]);
		}
		return new File(name.toString());
	}
	
	public String getDeploymentId() {
		return String.valueOf(lifeCycleService.getStartTime().getTime());
	}
	

	public void setBaseUrl(String baseUrl) {
		this.baseUrl = baseUrl;
	}

	public String getBaseUrl() {
		return baseUrl;
	}

	public void setDevelopmentMode(boolean developmentMode) {
		this.developmentMode = developmentMode;
	}

	public boolean isDevelopmentMode() {
		return developmentMode;
	}

	public void setStoragePath(String storagePath) {
		this.storagePath = storagePath;
	}
	
	public File getStorageDir() {
		return storageDir;
	}
	
	public File getIndexDir() {
		return indexDir;
	}

	public String getStoragePath() {
		return storagePath;
	}

	public void setImageMagickPath(String imageMagickPath) {
		this.imageMagickPath = imageMagickPath;
	}

	public String getImageMagickPath() {
		return imageMagickPath;
	}

	public void setGraphvizPath(String graphvizPath) {
		this.graphvizPath = graphvizPath;
	}

	public String getGraphvizPath() {
		return graphvizPath;
	}

	public void setBasePath(String basePath) {
		this.basePath = basePath;
	}

	public String getBasePath() {
		return basePath;
	}

	public String getDevelopmentUser() {
		return developmentUser;
	}

	public void setDevelopmentUser(String developmentUser) {
		this.developmentUser = developmentUser;
	}

	public String getAnalyticsCode() {
		return analyticsCode;
	}

	public void setAnalyticsCode(String analyticsCode) {
		this.analyticsCode = analyticsCode;
	}
	
	public String getApplicationContext(String app, String path, Request request) {
		Locale locale = request.getLocale();
		if (StringUtils.isBlank(rootDomain)) {
			return request.getBaseContext()+"/app/words/"+locale.getLanguage()+"/";
		}
		HttpServletRequest servletRequest = request.getRequest();
		StringBuilder url = new StringBuilder();
		url.append("http://").append(app).append(".").append(rootDomain);
		if (servletRequest.getServerPort()!=80) {
			url.append(":").append(servletRequest.getServerPort());
		}
		url.append(request.getBaseContext());
		if (appLocales.containsEntry(app, locale)) {
			url.append("/").append(locale.getLanguage());
		}
		if (path!=null) {
			url.append(path);
		} else {
			url.append("/");
		}
		if (request.isLoggedIn()) {
			url.append(";jsessionid="+servletRequest.getSession().getId());
		}
		return url.toString();
	}

	public String getRootDomain() {
		return rootDomain;
	}

	public void setRootDomain(String rootDomain) {
		this.rootDomain = rootDomain;
	}
	
	public void setLifeCycleService(LifeCycleService lifeCycleService) {
		this.lifeCycleService = lifeCycleService;
	}
}
