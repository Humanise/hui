package dk.in2isoft.onlineobjects.core;

import java.io.File;
import java.net.URL;

import org.apache.commons.configuration.XMLConfiguration;
import org.apache.log4j.Logger;

public class Configuration {
	
	Logger log = Logger.getLogger(Configuration.class);
	
	private XMLConfiguration config;
	private File baseDir;
	private File tempDir;
	private File storageDir;
	
	public Configuration(File baseDir)
	throws ConfigurationException {
		this.baseDir = baseDir;
		try {
	        URL url = this.getClass().getClassLoader().getResource("onlineobjects.cfg.xml");
			config = new XMLConfiguration(url);
			storageDir = new File(config.getString("storage.dir"));
			log.info("Storage directory is: "+storageDir);
			if (storageDir.canWrite()) {
				log.info("Storage can be written");
			} else {
				throw new ConfigurationException("Unable to write to storage directory on path: "+storageDir);
			}
			log.info("Base url is: "+getBaseUrl());
		} catch (org.apache.commons.configuration.ConfigurationException e) {
			throw new ConfigurationException("Could not load configuration file",e);
		}
		tempDir = new File(storageDir,"temporary");
		if (!tempDir.isDirectory()) {
			if (!tempDir.mkdir()) {
				throw new ConfigurationException("The temporary directory does not exists");
			}
			log.info("Created temporary directory");
		} else if (!tempDir.canWrite()) {
			throw new ConfigurationException("Can not write to the temporary directory");
		}
	}

	public String getBaseUrl() {
		return config.getString("base-url");
	}

	public String getImageMagickPath() {
		return config.getString("integration.imagemagick.path");
	}

	public String getGraphvizPath() {
		return config.getString("integration.graphviz.path");
	}
	
	public String getBaseDir() {
		return baseDir.getAbsolutePath();
	}
	
	public File getBaseDirectory() {
		return baseDir;
	}
	
	public File getTempDir() {
		return tempDir;
	}
	
	public String getMailHost() {
		return config.getString("mail.host");
	}
	
	public String getMailUsername() {
		return config.getString("mail.username");
	}
	
	public String getMailPassword() {
		return config.getString("mail.password");
	}
	
	public File getFile(String[] path) {
		StringBuilder name = new StringBuilder();
		name.append(baseDir.getAbsolutePath());
		for (int i = 0; i < path.length; i++) {
			name.append(File.separatorChar);
			name.append(path[i]);
		}
		return new File(name.toString());
	}

	public File getStorageDir() {
		return storageDir;
	}
}
