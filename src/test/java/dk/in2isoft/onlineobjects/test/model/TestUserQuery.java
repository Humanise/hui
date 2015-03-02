package dk.in2isoft.onlineobjects.test.model;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestUserQuery extends AbstractSpringTestCase {
    	
	@Test
	public void testThis() throws EndUserException {
		Privileged priviledged = getPublicUser();
		User user = new User();
		user.setUsername("unitTestUser");
		Person person = new Person();
		person.setGivenName("test89898897");
		modelService.createItem(user, priviledged);
		modelService.createItem(person, priviledged);
		modelService.createRelation(user, person, priviledged);
		{
			UserQuery query = new UserQuery().withUsername("unitTestUser");
			PairSearchResult<User,Person> pairs = modelService.searchPairs(query);
			assertEquals(1, pairs.getTotalCount());
		}
		{
			UserQuery query = new UserQuery().withWords("test89898897");
			PairSearchResult<User,Person> pairs = modelService.searchPairs(query);
			assertEquals(1, pairs.getTotalCount());
			assertEquals(pairs.getFirst().getKey().getId(),user.getId());
		}
		modelService.deleteEntity(user, priviledged);
		modelService.deleteEntity(person, priviledged);
		{
			UserQuery query = new UserQuery().withUsername("unitTestUser");
			PairSearchResult<User,Person> pairs = modelService.searchPairs(query);
			assertEquals(0, pairs.getTotalCount());
		}
		modelService.commit();
	}
}
