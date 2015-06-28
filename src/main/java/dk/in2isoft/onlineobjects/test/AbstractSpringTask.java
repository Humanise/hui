package dk.in2isoft.onlineobjects.test;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.xml")
public abstract class AbstractSpringTask extends AbstractJUnit4SpringContextTests {
	
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

	protected String getProperty(String name) {
		Resource resource = context.getResource("configuration.properties");
		Properties p = new Properties();
		try {
			p.load(resource.getInputStream());
			return p.getProperty(name);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
}
