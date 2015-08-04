package dk.in2isoft.onlineobjects.test;


import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

import org.apache.commons.io.IOUtils;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.test.xml")
public abstract class AbstractSpringTestCase extends AbstractJUnit4SpringContextTests {
	
	@Autowired
	protected ConfigurationService configurationService;
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
	protected ModelService modelService;

	protected File getTestFile(String name) throws IOException {
		File file = context.getResource(name).getFile();
		return file;
	}
	
	protected String getTestFileAsString(String name) throws IOException {
		File file = getTestFile(name);
		try (FileReader reader = new FileReader(file)) {
			return IOUtils.toString(reader);
		}
	}

	protected Privileged getPublicUser() {
		return modelService.getUser("public");
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

	public void setContext(ApplicationContext context) {
		this.context = context;
	}

	public ApplicationContext getContext() {
		return context;
	}

	protected void print(String string, Object object) {
		System.out.println(string+": "+object);
	}

	protected File getResourcesDir() {
		return new File(getProperty("test.resources.dir"));
	}

	protected String getProperty(String name) {
		Resource resource = context.getResource("test.properties");
		Properties p = new Properties();
		try {
			p.load(resource.getInputStream());
			return p.getProperty(name);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	protected File getOutputDir() {

		String outputDir = getProperty("output.dir");
		if (Strings.isBlank(outputDir)) {
			throw new IllegalStateException("The output.dir property is not set");
		}
		File dir = new File(outputDir);
		if (!dir.exists()) {
			throw new IllegalStateException("The output dir does not exists");
		}
		if (!dir.isDirectory()) {
			throw new IllegalStateException("The output dir is not a folder");
		}
		if (!dir.canWrite()) {
			throw new IllegalStateException("The output dir can not be written");
		}
		return dir;
	}
}
