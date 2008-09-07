package dk.in2isoft.onlineobjects.test.model;

import java.sql.SQLException;
import java.util.List;

import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebNode;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestRelations extends AbstractTestCase {


	public void testRelations() throws SQLException, ModelException, SecurityException {
		User priviledged = getPublicUser();
		ModelFacade model = getModel();

		WebPage page = new WebPage();
		model.createItem(page, priviledged);
		autoClean(page);
		assertTrue(page.getId() > 0);
		model.commit();

		WebNode node = new WebNode();
		model.createItem(node, priviledged);
		autoClean(node);
		model.createRelation(page, node, priviledged);
		model.commit();

		Person person = new Person();
		model.createItem(person, priviledged);
		autoClean(person);
		model.createRelation(page, person, priviledged);
		model.commit();
		{
			List<Relation> childRelations = model.getChildRelations(page);
			assertTrue(childRelations.size() == 2);
		}
		{
			List<Relation> childRelations = model.getChildRelations(page, WebNode.class);
			assertTrue(childRelations.size() == 1);
			assertTrue(childRelations.get(0).getSubEntity() instanceof WebNode);
		}
		{
			List<Relation> childRelations = model.getChildRelations(page, Person.class);
			assertTrue(childRelations.size() == 1);
			assertTrue(childRelations.get(0).getSubEntity() instanceof Person);
		}

		model.commit();
	}

}
