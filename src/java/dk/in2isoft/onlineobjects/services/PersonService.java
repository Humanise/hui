package dk.in2isoft.onlineobjects.services;

import org.joda.time.DateTime;
import org.joda.time.Period;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Address;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;

public class PersonService {

	private ModelService modelService;
	
	public Person getUsersMainPerson(User user) throws ModelException {
		return modelService.getChild(user, Person.class);
	}
	
	public Address getPersonsPreferredAddress(Person person) throws ModelException {
		return modelService.getChild(person, Property.KEY_COMMON_PREFERRED, Address.class);
	}
	
	public void updatePersonsPreferredAddress(Person person, Address address, Privileged privileged) throws ModelException, SecurityException {
		Address existing = getPersonsPreferredAddress(person);
		if (existing!=null) {
			existing.setStreet(address.getStreet());
			existing.setCity(address.getCity());
			existing.setRegion(address.getRegion());
			existing.setPostalCode(address.getPostalCode());
			existing.setCountry(address.getCountry());
			modelService.updateItem(existing, privileged);
		} else {
			modelService.createItem(address, privileged);
			modelService.createRelation(person, address, Property.KEY_COMMON_PREFERRED, privileged);
		}
	}
	
	public Integer getYearsOld(Person person) {
		if (person==null || person.getBirthday()==null) {
			return null;
		}
		DateTime now = new DateTime();
		Period period = new Period(new DateTime(person.getBirthday()),now);
		return period.getYears();
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
