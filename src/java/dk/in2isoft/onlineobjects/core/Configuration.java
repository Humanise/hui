package dk.in2isoft.onlineobjects.core;

import java.io.File;

import org.apache.commons.configuration.XMLConfiguration;
import org.apache.log4j.Logger;

public class Configuration {
	
	Logger log = Logger.getLogger(Configuration.class);
	
	private XMLConfiguration config;
	private File baseDir;
	private File tempDir;
	
	public Configuration(File baseDir)
	throws ConfigurationException {
		this.baseDir = baseDir;
		File webinf = new File(baseDir,"WEB-INF");
		File infoDir = new File(webinf,"info");
		File configFile = new File(infoDir,"configuration.xml");
		try {
			config = new XMLConfiguration(configFile);
			log.info("Base url is: "+getBaseUrl());
		} catch (org.apache.commons.configuration.ConfigurationException e) {
			throw new ConfigurationException("Could not load configuration file",e);
		}
		tempDir = new File(webinf,"temporary");
		if (!tempDir.isDirectory()) {
			throw new ConfigurationException("The temporary directory does not exists");
		} else if (!tempDir.canWrite()) {
			throw new ConfigurationException("Can not write to the temporary directory");
		}
	}

	public String getBaseUrl() {
		return config.getString("base-url");
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
	
	public File getFile(String[] path) {
		StringBuilder name = new StringBuilder();
		name.append(baseDir.getAbsolutePath());
		for (int i = 0; i < path.length; i++) {
			name.append(File.separatorChar);
			name.append(path[i]);
		}
		return new File(name.toString());
	}
}
