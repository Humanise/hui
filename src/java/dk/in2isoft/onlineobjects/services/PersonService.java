package dk.in2isoft.onlineobjects.services;

import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTime;
import org.joda.time.Period;

import dk.in2isoft.commons.lang.Strings;
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
	
	public String getFullPersonName(Person person, int maxLength) {
		String fullName = person.getFullName();
		String given = person.getGivenName();
		String givenFirst = abbreviate(given);
		String family = person.getFamilyName();
		String familyFirst = abbreviate(family);
		String additional = person.getAdditionalName();
		String additionalFirst = abbreviate(additional);
		if (fullName.length()>maxLength) {

			String givenAdditionFirstFamily = Strings.concatWords(given, additionalFirst, family);
			if (givenAdditionFirstFamily.length()<=maxLength) {
				return givenAdditionFirstFamily;
			}
			
			String givenFamily = Strings.concatWords(given, family);
			if (givenFamily.length()<=maxLength) {
				return givenFamily;
			}
			
			String givenFirstFamily = Strings.concatWords(givenFirst, family);
			if (givenFirstFamily.length()<=maxLength) {
				return givenFirstFamily;
			}
		}
		return StringUtils.abbreviate(fullName,maxLength);
	}

	private String abbreviate(String name) {
		if (Strings.isBlank(name)) {
			return null;
		}
		return name.trim().substring(0, 1).toUpperCase()+".";
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
