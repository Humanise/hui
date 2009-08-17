package dk.in2isoft.onlineobjects.test.traffic;

import java.net.MalformedURLException;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.parsing.HTMLReference;
import dk.in2isoft.onlineobjects.core.ModelService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.xml")
public class TestHtmlDocumentParser extends AbstractJUnit4SpringContextTests {
    
	@Autowired
	private ModelService modelService;
	
	@Test
	public void testThis() throws MalformedURLException {
		HTMLDocument htmlDocument = new HTMLDocument("http://www.apple.com");
		String text = htmlDocument.getText();
		List<HTMLReference> references = htmlDocument.getReferences();
		references.toString();
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}
}
