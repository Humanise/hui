package dk.in2isoft.commons.util;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.ConfigurationException;
import dk.in2isoft.onlineobjects.core.Core;

public class TemporaryDirectory {
	
	private static Logger log = Logger.getLogger(TemporaryDirectory.class);
	
	private File dir;
	
	private TemporaryDirectory() throws ConfigurationException, IOException {
		File tempDir = Core.getInstance().getConfigurationService().getTempDir();
		dir = new File(tempDir,"temp_"+new Date().getTime());
		if (!dir.mkdir()) {
			throw new IOException("Could not create temporary directory");
		}
		log.debug("Temp dir is:"+dir.getCanonicalPath());
	}
	
	public static TemporaryDirectory create()
	throws ConfigurationException, IOException {
		return new TemporaryDirectory();
	}
	
	public File getDirectory() {
		return dir;
	}
	
	public void clean() {
		//FileUtils.deleteDirectory(dir);
	}
}
