package dk.in2isoft.onlineobjects.model.conversion;

import nu.xom.Element;
import nu.xom.Node;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Person;

public class PersonConverter extends EntityConverter {

	@Override
	protected Node generateSubXML(Entity entity) {
		Person person = (Person) entity;
		Element root = new Element("Person",Person.NAMESPACE);
		addSimpleNode(root,"namePrefix",person.getNamePrefix(),Person.NAMESPACE);
		addSimpleNode(root,"givenName",person.getGivenName(),Person.NAMESPACE);
		addSimpleNode(root,"familyName",person.getFamilyName(),Person.NAMESPACE);
		addSimpleNode(root,"nameSuffix",person.getNameSuffix(),Person.NAMESPACE);
		return root;
	}

}
