package dk.in2isoft.onlineobjects.test.model;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.Assert;
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
	
	@Test
	public void testName() {
		{
			Person person = new Person();
			person.setFullName("Ludwig Mies van der Rohe");
			assertEquals("Ludwig", person.getGivenName());
			assertEquals("Mies van der", person.getAdditionalName());
			assertEquals("Rohe", person.getFamilyName());
			
			person.setFullName(null);
			Assert.assertNull(person.getGivenName());
			Assert.assertNull(person.getAdditionalName());
			Assert.assertNull(person.getFamilyName());
			
			person.setFullName("");
			Assert.assertNull(person.getGivenName());
			Assert.assertNull(person.getAdditionalName());
			Assert.assertNull(person.getFamilyName());
			
			person.setFullName("Jonas Munk");
			assertEquals("Jonas", person.getGivenName());
			assertEquals(null, person.getAdditionalName());
			assertEquals("Munk", person.getFamilyName());
			
			person.setFullName("Jonas");
			assertEquals("Jonas", person.getGivenName());
			assertEquals(null, person.getAdditionalName());
			assertEquals(null, person.getFamilyName());
			
			person.setFullName("  Jonas \n\tBrinkmann  \nMunk   \n");
			assertEquals("Jonas", person.getGivenName());
			assertEquals("Brinkmann", person.getAdditionalName());
			assertEquals("Munk", person.getFamilyName());
		}
	}
}
