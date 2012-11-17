package dk.in2isoft.onlineobjects.test.model;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.Test;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;


public class TestPerson extends AbstractSpringTestCase {

	@Test
	public void testCreate() throws EndUserException {
		Privileged priviledged = getPublicUser();
		Person person = new Person();
		person.setGivenName("Jonas1");
		person.setAdditionalName("Brinkmann2");
		person.setFamilyName("Munk3");
		assertEquals("Jonas1 Brinkmann2 Munk3", person.getName());
		modelService.createItem(person, priviledged);
		{
			Query<Person> query = Query.of(Person.class).withName("Jonas1 Brinkmann2 Munk3");
			List<Person> list = modelService.list(query);
			assertEquals(1, list.size());
		}
		
		modelService.deleteEntity(person, priviledged);
		modelService.commit();
	}
}
