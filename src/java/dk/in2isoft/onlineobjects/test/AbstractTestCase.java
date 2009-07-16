package dk.in2isoft.onlineobjects.test;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Properties;

import junit.framework.TestCase;

import org.apache.log4j.Logger;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.User;

public class AbstractTestCase extends TestCase {
	
	protected Properties properties;
	private static Logger log = Logger.getLogger(AbstractTestCase.class);
	private ArrayList<Entity> entitysToClean = Lists.newArrayList();
	
	protected void setUp() throws Exception {
		InputStream stream = getClass().getClassLoader().getResourceAsStream("test.properties");
		properties = new Properties();
		properties.load(stream);
		stream.close();
		String basePath = properties.getProperty("basePath");
		if (!Core.getInstance().isStarted()) {
			Core.getInstance().start(basePath, null);
		}
	}
	
	protected ModelService getModel() {
		return Core.getInstance().getModel();
	}
	
	protected void info(String msg) {
		log.info(msg);
	}
	
	protected User getPublicUser() {
		return getModel().getUser(SecurityService.PUBLIC_USERNAME);
	}

	protected void autoClean(Entity entity) {
		entitysToClean.add(entity);
	}

	protected void tearDown() throws Exception {
		User priviledged = getPublicUser();
		for (Entity entity : entitysToClean) {
			getModel().deleteEntity(entity, priviledged);
		}
		getModel().commit();
	}
}
