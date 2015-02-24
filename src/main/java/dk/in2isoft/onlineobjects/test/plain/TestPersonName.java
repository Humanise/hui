package dk.in2isoft.onlineobjects.test.plain;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.services.PersonService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestPersonName extends AbstractSpringTestCase {

	@Autowired
	private PersonService personService;
	
	@Test
	public void testGetFullPersonName() {
		{
			Person person = new Person();
			person.setGivenName("Jonas");
			person.setFamilyName("Munk");
			person.setAdditionalName("Brinkmann");
			Assert.assertEquals("Jonas Brinkmann Munk",personService.getFullPersonName(person, Integer.MAX_VALUE));
			Assert.assertEquals("Jonas B. Munk",personService.getFullPersonName(person, 13));
			Assert.assertEquals("Jonas Munk",personService.getFullPersonName(person, 10));
			Assert.assertEquals("J. Munk",personService.getFullPersonName(person, 7));
		}
	}
}
