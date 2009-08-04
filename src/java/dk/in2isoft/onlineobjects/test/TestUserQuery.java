package dk.in2isoft.onlineobjects.test;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.xml")
public class TestUserQuery extends AbstractJUnit4SpringContextTests {
    
	@Autowired
	private ModelService modelService;

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}
	
	@Test
	public void testThis() {
		
		UserQuery query = new UserQuery().withUsername("jbm");
		PairSearchResult<User,Person> pairs = modelService.searchPairs(query);
		int totalCount = pairs.getTotalCount();
		Assert.assertEquals(totalCount, 1);
	}
}
