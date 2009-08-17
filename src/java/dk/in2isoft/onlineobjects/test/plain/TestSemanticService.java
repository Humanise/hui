package dk.in2isoft.onlineobjects.test.plain;

import java.net.MalformedURLException;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestSemanticService extends AbstractTestCase {
	
	private static Logger log = Logger.getLogger(TestSemanticService.class);
	
	@Autowired
	private SemanticService semanticService;
	
	@Test
	public void testVelocity() throws EndUserException, MalformedURLException {
		Assert.assertArrayEquals(new String[] {},semanticService.getWords(""));
		Assert.assertArrayEquals(new String[] {},semanticService.getWords("  "));

		Assert.assertArrayEquals(new String[] {"Eat","my","shorts"},semanticService.getWords("Eat my shorts"));
		Assert.assertArrayEquals(new String[] {"Eat","my","shorts"},semanticService.getWords("Eat my       shorts"));
		Assert.assertArrayEquals(new String[] {"Eat","my","shorts"},semanticService.getWords("Eat my shorts."));
		Assert.assertArrayEquals(new String[] {"Eat","my","shorts"},semanticService.getWords("Eat, \nmy _ shorts."));
	}

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}

	public SemanticService getSemanticService() {
		return semanticService;
	}
}