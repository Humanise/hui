package dk.in2isoft.onlineobjects.test.model;

import static org.junit.Assert.assertTrue;

import java.sql.SQLException;
import java.util.List;

import org.junit.Test;

import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.WebNode;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestRelations extends AbstractSpringTestCase {

	@Test
	public void testRelations() throws SQLException, ModelException, SecurityException {
		Privileged priviledged = getPublicUser();

		WebPage page = new WebPage();
		modelService.createItem(page, priviledged);
		assertTrue(page.getId() > 0);
		modelService.commit();

		WebNode node = new WebNode();
		modelService.createItem(node, priviledged);
		modelService.createRelation(page, node, priviledged);

		Person person = new Person();
		modelService.createItem(person, priviledged);
		modelService.createRelation(page, person, priviledged);
		{
			List<Relation> childRelations = modelService.getRelationsFrom(page);
			assertTrue(childRelations.size() == 2);
		}
		{
			List<Relation> childRelations = modelService.getRelationsFrom(page, WebNode.class);
			assertTrue(childRelations.size() == 1);
			assertTrue(childRelations.get(0).getTo() instanceof WebNode);
		}
		{
			List<Relation> childRelations = modelService.getRelationsFrom(page, Person.class);
			assertTrue(childRelations.size() == 1);
			assertTrue(childRelations.get(0).getTo() instanceof Person);
		}
		modelService.deleteEntity(page, priviledged);
		modelService.deleteEntity(node, priviledged);
		modelService.deleteEntity(person, priviledged);
		modelService.commit();
	}

}
