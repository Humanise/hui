package dk.in2isoft.onlineobjects.test.model;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.Test;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;


public class TestPerson extends AbstractSpringTestCase {

	@Test
	public void testCreate() throws EndUserException {
		String givenName = Strings.generateRandomString(5);
		String additionalName = Strings.generateRandomString(5);
		String familyName = Strings.generateRandomString(5);
		Privileged priviledged = getPublicUser();
		Person person = new Person();
		person.setGivenName(givenName);
		person.setAdditionalName(additionalName);
		person.setFamilyName(familyName);
		assertEquals(givenName+" "+additionalName+" "+familyName, person.getName());
		modelService.createItem(person, priviledged);
		{
			Query<Person> query = Query.of(Person.class).withName(givenName+" "+additionalName+" "+familyName);
			List<Person> list = modelService.list(query);
			assertEquals(1, list.size());
		}
		
		modelService.deleteEntity(person, priviledged);
		modelService.commit();
	}
}
