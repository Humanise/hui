package dk.in2isoft.onlineobjects.test.traffic;

import java.net.MalformedURLException;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.xml")
public class TestHtmlDocument extends AbstractSpringTestCase {
    
	@Autowired
	private ModelService modelService;
	
	@Test
	public void testThis() throws MalformedURLException {
		HTMLDocument htmlDocument = new HTMLDocument("http://www.apple.com");
		Assert.assertEquals("Apple", htmlDocument.getTitle());
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}
}
